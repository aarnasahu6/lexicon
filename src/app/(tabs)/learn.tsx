import { useState } from "react";
import { View, Pressable } from "react-native";
import {
  Screen,
  Copy,
  Card,
  Heading,
  Label,
  Choices,
  Input,
  Button,
  Notice,
  s,
} from "../../components/ui";
import { colors as c } from "../../components/theme";
import { terms } from "../../data/terms";
import { useApp } from "../../state/AppState";
export default function Learn() {
  const { data, saveTerm, toggleLearned, error } = useApp();
  const [filter, setFilter] = useState("Saved"),
    [search, setSearch] = useState(""),
    [flash, setFlash] = useState(false),
    [index, setIndex] = useState(0),
    [revealed, setRevealed] = useState(false);
  const language = data.profile?.language || "Hindi / Hinglish";
  const items = (
    filter === "Explore all"
      ? terms(language)
      : data.saved.filter((t) => filter !== "Learned" || t.learned)
  ).filter((t) =>
    `${t.term} ${t.definition}`.toLowerCase().includes(search.toLowerCase()),
  );
  const deck = data.saved;
  const active = deck[index % Math.max(deck.length, 1)];
  const [feedback, setFeedback] = useState("");
  async function safely(fn: () => Promise<void>) {
    try {
      await fn();
      setFeedback("");
    } catch {
      setFeedback("Your change could not be saved. Please try again.");
    }
  }
  return (
    <Screen
      kicker="A VOCABULARY THAT GOES WITH YOU"
      title="Make the words yours."
    >
      <Copy>
        {data.saved.filter((t) => t.learned).length} learned ·{" "}
        {data.saved.length} saved · 22 terms to explore
      </Copy>
      {deck.length > 0 && (
        <Button
          secondary
          onPress={() => {
            setFlash(!flash);
            setIndex(0);
            setRevealed(false);
          }}
        >
          {flash ? "Close flashcards" : "Practice with flashcards →"}
        </Button>
      )}
      {flash && active ? (
        <Card
          style={{
            backgroundColor: c.secondary,
            minHeight: 320,
            justifyContent: "space-between",
          }}
        >
          <Label>
            FLASHCARD {(index % deck.length) + 1} / {deck.length}
          </Label>
          <Heading>{active.term}</Heading>
          {revealed ? (
            <>
              <Copy>{active.definition}</Copy>
              <Copy style={{ color: c.muted }}>
                {active.localizedExplanation}
              </Copy>
              <Button
                secondary
                onPress={() => safely(() => toggleLearned(active.id))}
              >
                {active.learned
                  ? "✓ Learned · mark for review"
                  : "Mark as learned"}
              </Button>
            </>
          ) : (
            <Button secondary onPress={() => setRevealed(true)}>
              Reveal meaning
            </Button>
          )}
          <Button
            onPress={() => {
              setIndex(index + 1);
              setRevealed(false);
            }}
          >
            Next card →
          </Button>
        </Card>
      ) : (
        <>
          <Choices
            values={["Saved", "Explore all", "Learned"]}
            value={filter}
            onChange={setFilter}
          />
          <Input
            accessibilityLabel="Search vocabulary"
            placeholder="Find a term…"
            value={search}
            onChangeText={setSearch}
          />
          {!items.length ? (
            <Card>
              <Heading style={{ fontSize: 28 }}>
                Your next word is waiting.
              </Heading>
              <Copy>
                {search
                  ? "No matching terms. Try a different search."
                  : "Save a concept from Bridge, or explore the finance glossary."}
              </Copy>
              <Button
                secondary
                onPress={() => {
                  setFilter("Explore all");
                  setSearch("");
                }}
              >
                Explore finance terms
              </Button>
            </Card>
          ) : (
            items.map((t) => {
              const saved = data.saved.find((x) => x.term === t.term);
              return (
                <Card key={t.term}>
                  <View style={s.row}>
                    <Heading style={{ fontSize: 29, lineHeight: 33, flex: 1 }}>
                      {t.term}
                    </Heading>
                    {saved?.learned && (
                      <Copy style={{ fontSize: 12, color: c.success }}>
                        ✓ LEARNED
                      </Copy>
                    )}
                  </View>
                  <Copy>{t.definition}</Copy>
                  <Copy style={{ color: c.muted }}>
                    {t.localizedExplanation}
                  </Copy>
                  <View
                    style={{
                      borderLeftColor: c.accent,
                      borderLeftWidth: 3,
                      paddingLeft: 14,
                    }}
                  >
                    <Label>IN A SENTENCE</Label>
                    <Copy style={{ fontSize: 14 }}>{t.example}</Copy>
                  </View>
                  {saved ? (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: saved.learned }}
                      onPress={() => safely(() => toggleLearned(saved.id))}
                      style={{ paddingVertical: 12 }}
                    >
                      <Copy style={{ color: c.primary }}>
                        {saved.learned
                          ? "✓ Learned · tap to review again"
                          : "○ Mark as learned"}
                      </Copy>
                    </Pressable>
                  ) : (
                    <Button secondary onPress={() => safely(() => saveTerm(t))}>
                      ＋ Save term
                    </Button>
                  )}
                </Card>
              );
            })
          )}
        </>
      )}
      {(error || feedback) && <Notice error>{feedback || error}</Notice>}
      <Notice>
        Your saved vocabulary is available on this device offline. Downloadable
        language packs are planned.
      </Notice>
    </Screen>
  );
}
