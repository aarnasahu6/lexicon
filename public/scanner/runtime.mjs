import Tesseract from "./vendor/tesseract.esm.min.js";
import * as pdfjs from "./vendor/pdf.mjs";
const vendor = new URL("./vendor/", import.meta.url).href;
pdfjs.GlobalWorkerOptions.workerSrc = vendor + "pdf.worker.mjs";
const MAX_PAGES = 10;
const MAX_CHARS = 5000;

// Files stay in browser memory. Only static engine assets are fetched.
async function extract(file, language, progress, signal) {
  let worker, loading, document;
  const check = () => {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  };
  const cancel = () => {
    void worker?.terminate();
    void loading?.destroy();
  };
  signal.addEventListener("abort", cancel, { once: true });
  const notes = [];
  let confidence;
  async function recognize(image) {
    check();
    if (!worker) {
      progress("Loading text recognition…");
      worker = await Tesseract.createWorker(language, 1, {
        workerPath: vendor + "worker.min.js",
        corePath: vendor,
        langPath: vendor.replace(/\/$/, ""),
        logger: (m) => {
          if (!signal.aborted)
            progress(
              m.status === "recognizing text"
                ? `Reading text · ${Math.round(m.progress * 100)}%`
                : "Preparing text recognition…",
            );
        },
      });
    }
    check();
    const result = await worker.recognize(image);
    confidence = Math.min(confidence ?? 100, result.data.confidence);
    return result.data.text;
  }
  try {
    check();
    if (file.size > 20 * 1024 * 1024)
      throw new Error("Choose a file smaller than 20 MB.");
    let text = "";
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      progress("Opening PDF…");
      loading = pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
        cMapUrl: vendor + "cmaps/",
        cMapPacked: true,
        standardFontDataUrl: vendor + "standard_fonts/",
        wasmUrl: vendor + "wasm/",
        isEvalSupported: false,
      });
      document = await loading.promise;
      check();
      if (document.numPages > MAX_PAGES)
        notes.push(
          `Read the first ${MAX_PAGES} of ${document.numPages} pages. Split the PDF to read later pages.`,
        );
      for (let i = 1; i <= Math.min(document.numPages, MAX_PAGES); i++) {
        check();
        progress(`Reading PDF page ${i}…`);
        const page = await document.getPage(i);
        const content = await page.getTextContent();
        let pageText = content.items
          .map((item) =>
            "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "",
          )
          .join("");
        if (pageText.trim().length < 20) {
          const original = page.getViewport({ scale: 1 });
          const scale = Math.min(
            2,
            2400 / Math.max(original.width, original.height),
          );
          const viewport = page.getViewport({ scale });
          const canvas = globalThis.document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          try {
            await page.render({ canvas, viewport }).promise;
            pageText = await recognize(canvas);
          } finally {
            canvas.width = canvas.height = 0;
          }
        }
        text += pageText + "\n\n";
        page.cleanup();
        if (text.length >= MAX_CHARS) {
          if (i < document.numPages)
            notes.push(`Stopped after page ${i}; later pages were not read.`);
          break;
        }
      }
    } else if (
      file.type.startsWith("image/") ||
      /\.(png|jpe?g|webp|bmp)$/i.test(file.name)
    ) {
      const bitmap = await createImageBitmap(file).catch(() => {
        throw new Error(
          "This image format could not be read. Try a JPG or PNG photo.",
        );
      });
      const canvas = globalThis.document.createElement("canvas");
      const scale = Math.min(1, 3000 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      try {
        text = await recognize(canvas);
      } finally {
        canvas.width = canvas.height = 0;
      }
    } else if (file.type === "text/plain" || /\.txt$/i.test(file.name)) {
      text = await file.text();
    } else throw new Error("Choose a JPG, PNG, WebP, PDF, or plain text file.");
    check();
    text = text.replace(/\r\n?/g, "\n").trim();
    if (!text)
      throw new Error(
        "No readable text found. Try a sharper, well-lit photo with the page facing the camera.",
      );
    if (text.length > MAX_CHARS)
      notes.push(
        "Showing the first 5,000 characters. Scan a smaller section for the rest.",
      );
    if (confidence !== undefined && confidence < 70)
      notes.push(
        "Some words may be unclear. Check the extracted text before relying on the explanation.",
      );
    return { text: text.slice(0, MAX_CHARS), notes };
  } catch (error) {
    if (error?.name === "PasswordException")
      throw new Error(
        "This PDF is password-protected. Choose an unlocked copy.",
      );
    if (error?.name === "InvalidPDFException")
      throw new Error(
        "This PDF could not be opened. Try another PDF or a photo of the page.",
      );
    throw error;
  } finally {
    signal.removeEventListener("abort", cancel);
    await worker?.terminate().catch(() => {});
    await loading?.destroy().catch(() => {});
  }
}
globalThis.lexiconScanner = { extract };
