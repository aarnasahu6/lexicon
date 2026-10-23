const fs = require("node:fs");
const path = require("node:path");
const out = path.resolve(__dirname, "../public/scanner/vendor");
fs.mkdirSync(out, { recursive: true });
function copy(from, to) {
  fs.cpSync(from, path.join(out, to), { recursive: true });
}
const tess = path.dirname(require.resolve("tesseract.js/package.json"));
const core = path.dirname(
  require.resolve("tesseract.js-core/package.json", { paths: [tess] }),
);
for (const file of [
  "tesseract.esm.min.js",
  "worker.min.js",
  "tesseract.min.js.LICENSE.txt",
  "worker.min.js.LICENSE.txt",
])
  copy(path.join(tess, "dist", file), file);
for (const file of fs.readdirSync(core).filter((f) => /\.wasm(\.js)?$/.test(f)))
  copy(path.join(core, file), file);
copy(path.join(tess, "LICENSE.md"), "TESSERACT-LICENSE.md");
const pdf = path.dirname(require.resolve("pdfjs-dist/package.json"));
for (const file of ["pdf.mjs", "pdf.worker.mjs"])
  copy(path.join(pdf, "build", file), file);
for (const dir of ["cmaps", "standard_fonts", "wasm"])
  copy(path.join(pdf, dir), dir);
copy(path.join(pdf, "LICENSE"), "PDFJS-LICENSE");
for (const lang of ["eng", "spa", "hin"]) {
  const pkg = require(`@tesseract.js-data/${lang}`);
  copy(
    path.join(pkg.langPath, `${lang}.traineddata.gz`),
    `${lang}.traineddata.gz`,
  );
}
console.log("Local OCR and PDF assets ready.");
