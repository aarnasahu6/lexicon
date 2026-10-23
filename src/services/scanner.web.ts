type Extraction = { text: string; notes: string[] };
type Scanner = {
  extract: (
    file: File,
    language: string,
    progress: (status: string) => void,
    signal: AbortSignal,
  ) => Promise<Extraction>;
};
declare global {
  interface Window {
    lexiconScanner?: Scanner;
  }
}
let pending: Promise<Scanner> | undefined;
export function loadScanner(): Promise<Scanner> {
  if (window.lexiconScanner) return Promise.resolve(window.lexiconScanner);
  if (!pending)
    pending = new Promise<Scanner>((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      // Expo's entry script carries the configured deployment prefix, including GitHub Pages.
      const entry = Array.from(document.scripts).find((s) =>
        s.src.includes("/_expo/"),
      );
      const base = entry
        ? entry.src.split("/_expo/")[0]
        : window.location.origin;
      script.src = base + "/scanner/runtime.mjs";
      const timeout = window.setTimeout(() => fail(), 45000);
      function fail() {
        clearTimeout(timeout);
        script.remove();
        pending = undefined;
        reject(
          new Error(
            "Text recognition could not load. Connect to the internet and try again.",
          ),
        );
      }
      script.onerror = fail;
      script.onload = () => {
        clearTimeout(timeout);
        if (window.lexiconScanner) resolve(window.lexiconScanner);
        else fail();
      };
      document.head.appendChild(script);
    });
  return pending;
}
