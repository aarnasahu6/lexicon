import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Copy,
  Choices,
  Button,
  Card,
  Label,
  Notice,
} from "../components/ui";
import { Profile } from "../data/types";
import { useApp } from "../state/AppState";
export default function Onboarding() {
  const { data, setProfile, error } = useApp();
  const [p, setP] = useState<Profile>(
    data.profile || {
      language: "Hindi / Hinglish",
      stage: "Student",
      field: "Finance",
    },
  );
  const [busy, setBusy] = useState(false);
  return (
    <Screen
      kicker="A LITTLE ABOUT YOU"
      title="Speak the language of your profession."
    >
      <Copy>
        Build on the language you already know. Find the words your work needs.
      </Copy>
      <Card>
        <Label>01 · YOUR LANGUAGE</Label>
        <Copy>Which language do you want help with?</Copy>
        <Choices
          values={["Hindi / Hinglish", "Spanish", "English"] as const}
          value={p.language}
          onChange={(language) => setP({ ...p, language })}
        />
      </Card>
      <View style={{ gap: 12 }}>
        <Label>02 · YOUR NEXT CHAPTER</Label>
        <Copy>What best describes you?</Copy>
        <Choices
          values={["Student", "Intern", "New Grad", "Professional"] as const}
          value={p.stage}
          onChange={(stage) => setP({ ...p, stage })}
        />
      </View>
      <View style={{ gap: 12 }}>
        <Label>03 · YOUR WORLD OF WORK</Label>
        <Copy>What area are you interested in?</Copy>
        <Choices
          values={
            ["Finance", "Accounting", "Consulting", "General Business"] as const
          }
          value={p.field}
          onChange={(field) => setP({ ...p, field })}
        />
      </View>
      {error && <Notice error>{error}</Notice>}
      <Button
        busy={busy}
        onPress={async () => {
          setBusy(true);
          try {
            await setProfile(p);
            router.replace("/(tabs)/home");
          } catch {
          } finally {
            setBusy(false);
          }
        }}
      >
        Let’s get started →
      </Button>
      <Copy style={{ textAlign: "center", fontSize: 13 }}>
        Start with finance and business. Grow from here.
      </Copy>
    </Screen>
  );
}
