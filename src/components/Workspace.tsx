import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Screen,
  Copy,
  Label,
  Choices,
  Input,
  Button,
  Card,
  Notice,
  Heading,
} from "./ui";
import { colors as c } from "./theme";
import { Language, Result } from "../data/types";
import { useApp } from "../state/AppState";
import { explain, examples, scenarios } from "../services/offline";
export default function Workspace({
  action,
}: {
  action: "bridge" | "understand";
}) {
  const { data, saveTerm, addHistory } = useApp();
  const params = useLocalSearchParams<{ text?: string; historyId?: string }>();
  const [language, setLanguage] = useState<Language>(
      data.profile?.language || "Hindi / Hinglish",
    ),
    [input, setInput] = useState(""),
    [result, setResult] = useState<Result | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (data.profile) {
      setLanguage(data.profile.language);
      setResult(null);
    }
  }, [data.profile]);
  useEffect(() => {
    if (params.text) {
      setInput(params.text);
      setResult(null);
    }
    if (params.historyId) {
      const h = data.history.find((x) => x.id === params.historyId);
      if (h) {
        setInput(h.input_text);
        setResult(h.output);
      }
    }
  }, [params.text, params.historyId, data.history]);
  async function run() {
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const output = await explain({
        ...data.profile!,
        language,
        action,
        input,
      });
      setResult(output);
      await addHistory({
        id: `${Date.now()}-${Math.random()}`,
        action_type: action,
        input_text: input,
        output,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      kicker={
        action === "bridge" ? "EVERYDAY → PROFESSIONAL" : "COMPLEX → CLEAR"
      }
      title={
        action === "bridge" ? "Your words, elevated." : "Let’s make it click."
      }
    >
      <Copy>
        {action === "bridge"
          ? "Explore everyday situations and learn how finance professionals say it."
          : "Look up finance terms in your text, or unpack an included scenario."}
      </Copy>
      <Choices
        values={["Hindi / Hinglish", "Spanish", "English"] as const}
        value={language}
        onChange={(v) => {
          setLanguage(v);
          setResult(null);
        }}
      />
      {action === "bridge" && (
        <Choices
          values={scenarios.map((s) => s.title)}
          value={
            scenarios.find((s) => s.inputs[language] === input)?.title || ""
          }
          onChange={(title) => {
            setInput(
              scenarios.find((s) => s.title === title)!.inputs[language],
            );
            setResult(null);
            setError("");
          }}
        />
      )}
      <Card>
        <Label>
          {action === "bridge"
            ? "WHAT DO YOU WANT TO SAY?"
            : "WHAT WOULD YOU LIKE TO UNDERSTAND?"}
        </Label>
        <Input
          accessibilityLabel={
            action === "bridge"
              ? "Everyday language"
              : "Professional finance text"
          }
          multiline
          maxLength={5000}
          value={input}
          onChangeText={(v) => {
            setInput(v);
            setResult(null);
          }}
          placeholder={examples[action][language]}
        />
        <Copy style={{ fontSize: 12, color: c.muted, textAlign: "right" }}>
          {input.length} / 5,000
        </Copy>
        <Button
          secondary
          disabled={busy}
          onPress={() => {
            setInput(examples[action][language]);
            setResult(null);
            setError("");
          }}
        >
          Try an example ↗
        </Button>
        <Button busy={busy} disabled={!input.trim()} onPress={run}>
          {action === "bridge" ? "Make it professional" : "Explain this"} →
        </Button>
      </Card>
      <Notice>
        Works offline · Built-in scenarios and finance terminology. Your text
        stays on this device.
      </Notice>
      {error && <Notice error>{error}</Notice>}
      {result && (
        <View style={{ gap: 16 }}>
          <Label>YOUR LANGUAGE BRIDGE</Label>
          <Card>
            <Label>
              01 ·{" "}
              {result.responseKind === "glossary"
                ? "TERMS IN YOUR TEXT"
                : action === "bridge"
                  ? "WHAT YOU MEAN"
                  : "SIMPLE MEANING"}
            </Label>
            <Copy>{result.simpleMeaning}</Copy>
          </Card>
          <Copy style={{ textAlign: "center", color: c.primary }}>↓</Copy>
          {action === "bridge" && (
            <Card style={{ backgroundColor: c.primary }}>
              <Copy style={{ color: c.accent, fontSize: 12, letterSpacing: 2 }}>
                02 ·{" "}
                {result.responseKind === "glossary"
                  ? "EXAMPLE OF PROFESSIONAL USAGE"
                  : "PROFESSIONAL VERSION"}
              </Copy>
              <Heading
                style={{ color: c.background, fontSize: 28, lineHeight: 35 }}
              >
                {result.professionalVersion}
              </Heading>
            </Card>
          )}
          <Card style={{ backgroundColor: c.secondary }}>
            <Label>{action === "bridge" ? "03" : "02"} · LANGUAGE BRIDGE</Label>
            <Copy>{result.localizedExplanation}</Copy>
          </Card>
          <Label>FINANCE CONCEPTS · EXPLAIN IT</Label>
          {result.concepts.map((term) => (
            <Card key={term.term}>
              <Heading style={{ fontSize: 29, lineHeight: 33 }}>
                {term.term}
              </Heading>
              <Copy>{term.definition}</Copy>
              <Copy style={{ color: c.muted, fontSize: 14 }}>
                {term.localizedExplanation}
              </Copy>
              <Copy style={{ fontStyle: "italic", fontSize: 14 }}>
                {term.example}
              </Copy>
              <Button
                secondary
                disabled={data.saved.some((t) => t.term === term.term)}
                onPress={async () => {
                  try {
                    await saveTerm(term);
                  } catch {
                    setError("Could not save this term. Please try again.");
                  }
                }}
              >
                {data.saved.some((t) => t.term === term.term)
                  ? "✓ Saved to your vocabulary"
                  : "＋ Save term"}
              </Button>
            </Card>
          ))}
          <Card>
            <Label>WHY IT MATTERS</Label>
            <Copy>{result.whyItMatters}</Copy>
          </Card>
        </View>
      )}
    </Screen>
  );
}
