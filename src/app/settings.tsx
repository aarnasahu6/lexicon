import { router } from "expo-router";
import { Screen, Copy, Card, Label, Button } from "../components/ui";
import { useApp } from "../state/AppState";
export default function Settings() {
  const { data } = useApp();
  return (
    <Screen kicker="YOUR LEXICON" title="Made for your next step.">
      <Card>
        <Label>YOUR LEARNING PREFERENCES</Label>
        <Copy>
          {data.profile?.language} · {data.profile?.stage}
        </Copy>
        <Copy>{data.profile?.field}</Copy>
        <Button onPress={() => router.push("/onboarding")}>
          Edit preferences
        </Button>
      </Card>
      <Card>
        <Label>LOCAL. SIMPLE. YOURS.</Label>
        <Copy>
          No account, subscription, or API key. Your preferences, vocabulary,
          and progress are saved on this device.
        </Copy>
        <Copy>
          This edition includes 22 finance terms, six everyday-to-professional
          scenarios, and a financial-report example in English, Spanish, and
          Hinglish.
        </Copy>
        <Copy>
          All explanations are built in. The app does not send your text to an
          AI service or generate new rewrites.
        </Copy>
        <Copy>
          Clearing app data or uninstalling may remove your saved progress.
        </Copy>
      </Card>
      <Button secondary onPress={() => router.replace("/(tabs)/home")}>
        ← Back to Home
      </Button>
    </Screen>
  );
}
