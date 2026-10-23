import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  Screen,
  Copy,
  Card,
  Label,
  Button,
  Input,
  Notice,
  Choices,
  Heading,
} from "../../components/ui";
import { useApp } from "../../state/AppState";
import { Result } from "../../data/types";
import { explain, examples } from "../../services/offline";
import { loadScanner } from "../../services/scanner.web";

export default function Scan() {
  const { data, saveTerm } = useApp();
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [ocrLanguage, setOcrLanguage] = useState("English / Hinglish");
  const photo = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const current = useRef<AbortController | null>(null);
  useEffect(() => () => current.current?.abort(), []);
  useEffect(() => {
    setResult(null);
  }, [data.profile?.language]);

  async function generate(value: string, signal?: AbortSignal) {
    try {
      const output = await explain({
        language: data.profile?.language || "English",
        stage: data.profile?.stage || "Student",
        field: data.profile?.field || "General Business",
        action: "understand",
        input: value,
      });
      if (!signal?.aborted) setResult(output);
    } catch (e) {
      if (!signal?.aborted)
        setError(
          e instanceof Error ? e.message : "Could not explain this text.",
        );
    }
  }
  async function read(selected?: File) {
    if (!selected) return;
    current.current?.abort();
    const controller = new AbortController();
    current.current = controller;
    setBusy(true);
    setError("");
    setResult(null);
    setText("");
    setNotes([]);
    setName(selected.name);
    setStatus("Preparing your document…");
    const timeout = window.setTimeout(() => {
      if (current.current === controller) {
        controller.abort();
        setError(
          "Reading took too long. Try a smaller document or a clearer photo.",
        );
        setBusy(false);
        setStatus("");
      }
    }, 180000);
    try {
      if (selected.size > 20 * 1024 * 1024)
        throw new Error("Choose a file smaller than 20 MB.");
      const scanner = await loadScanner();
      if (controller.signal.aborted) return;
      const output = await scanner.extract(
        selected,
        ocrLanguage === "Spanish"
          ? "eng+spa"
          : ocrLanguage === "Hindi"
            ? "eng+hin"
            : "eng",
        (message) => {
          if (!controller.signal.aborted) setStatus(message);
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setText(output.text);
      setNotes(output.notes);
      setStatus("Text extracted.");
      await generate(output.text, controller.signal);
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(
          e instanceof Error
            ? e.message
            : "Could not read this document. Try a clear JPG or an unlocked PDF.",
        );
        setStatus("");
      }
    } finally {
      clearTimeout(timeout);
      if (current.current === controller) {
        setBusy(false);
        current.current = null;
      }
    }
  }
  function cancel() {
    current.current?.abort();
    current.current = null;
    setBusy(false);
    setStatus("Reading cancelled. Choose another file when ready.");
  }
  return (
    <Screen
      kicker="FROM THE PAGE TO UNDERSTANDING"
      title="See it. Understand it."
    >
      <Copy>
        Photograph a page or choose a file. We’ll extract the text and explain
        the business terms automatically.
      </Copy>
      <Card>
        <Label>LANGUAGE ON THE PAGE</Label>
        <Choices
          values={["English / Hinglish", "Spanish", "Hindi"]}
          value={ocrLanguage}
          onChange={(v) => {
            if (!busy) setOcrLanguage(v);
          }}
        />
        <input
          ref={photo}
          aria-label="Take a document photo"
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            const selected = e.target.files?.[0];
            e.target.value = "";
            void read(selected);
          }}
        />
        <input
          ref={file}
          aria-label="Upload document"
          type="file"
          accept="image/*,application/pdf,text/plain,.pdf,.txt"
          hidden
          onChange={(e) => {
            const selected = e.target.files?.[0];
            e.target.value = "";
            void read(selected);
          }}
        />
        <Button disabled={busy} onPress={() => photo.current?.click()}>
          Take a photo
        </Button>
        <Button secondary disabled={busy} onPress={() => file.current?.click()}>
          Upload photo or document
        </Button>
        <Copy>
          Photos, PDF, or TXT · up to 20 MB. Reads up to 10 PDF pages and 5,000
          characters. On desktop, “Take a photo” may open the file picker.
        </Copy>
        {name ? <Copy>{name}</Copy> : null}
        {status ? (
          <View accessibilityLiveRegion="polite">
            <Copy>{status}</Copy>
          </View>
        ) : null}
        {busy && (
          <Button secondary onPress={cancel}>
            Cancel reading
          </Button>
        )}
      </Card>
      <Notice>
        Files are processed in your browser, not uploaded. The reading tools
        need an internet connection to load initially. Clear, printed text works
        best.
      </Notice>
      {notes.map((note) => (
        <Notice key={note}>{note}</Notice>
      ))}
      <Card>
        <Label>EXTRACTED TEXT · REVIEW OR EDIT</Label>
        <Input
          accessibilityLabel="Document text"
          multiline
          editable={!busy}
          maxLength={5000}
          value={text}
          onChangeText={(v) => {
            setText(v);
            setResult(null);
            setError("");
          }}
          placeholder="Extracted text appears here. You can also paste text…"
        />
        <Copy>{text.length} / 5,000 characters</Copy>
        <Button
          disabled={busy || !text.trim()}
          onPress={() => {
            setError("");
            setResult(null);
            void generate(text);
          }}
        >
          Explain reviewed text →
        </Button>
        <Button
          secondary
          disabled={busy}
          onPress={() => {
            setName("Sample document");
            setNotes([]);
            setError("");
            setStatus("");
            const value = examples.understand.English;
            setText(value);
            void generate(value);
          }}
        >
          Try a sample document
        </Button>
      </Card>
      {error ? <Notice error>{error}</Notice> : null}
      {result && (
        <View style={{ gap: 16 }}>
          <Label>
            {result.responseKind === "glossary"
              ? "BUSINESS TERMS FOUND"
              : "YOUR EXPLANATION"}
          </Label>
          <Card>
            <Copy>{result.simpleMeaning}</Copy>
            {data.profile?.language !== "English" && (
              <Copy>{result.localizedExplanation}</Copy>
            )}
          </Card>
          {result.concepts.map((term) => (
            <Card key={term.term}>
              <Heading>{term.term}</Heading>
              <Copy>{term.definition}</Copy>
              <Copy>{term.example}</Copy>
              <Button
                secondary
                disabled={data.saved.some((t) => t.term === term.term)}
                onPress={() => {
                  void saveTerm(term).catch(() =>
                    setError("Could not save this term. Please try again."),
                  );
                }}
              >
                {data.saved.some((t) => t.term === term.term)
                  ? "Saved to your vocabulary"
                  : "Save term"}
              </Button>
            </Card>
          ))}
          <Notice>{result.whyItMatters}</Notice>
        </View>
      )}
    </Screen>
  );
}
