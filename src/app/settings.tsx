import { terms } from "../data/terms";
import { scenarios } from "../services/offline";
import { Linking } from "react-native";
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
          This edition includes {terms("English").length} business and finance
          terms, {scenarios.length} everyday-to-professional scenarios, and a
          financial-report example in English, Spanish, and Hinglish.
        </Copy>
        <Copy>
          All explanations are built in. The app does not send your text to an
          AI service or generate new rewrites.
        </Copy>
        <Copy>
          Clearing app data or uninstalling may remove your saved progress.
        </Copy>
      </Card>
      <Card>
        <Label>BUSINESS LANGUAGE IN CONTEXT</Label>
        <Copy>
          Reading reference: Charles Schwab 2025 Annual Report, CEO letter,
          printed page 3. Earnings per share, pre-tax profit margin and share
          buybacks connect the glossary to real reporting language.
        </Copy>
        <Copy>
          Definitions and practice scenarios are original educational examples,
          not quotations, company forecasts or an endorsement by Schwab. This is
          a built-in learning library, not a model trained on the report.
        </Copy>
        <Button
          secondary
          onPress={() =>
            Linking.openURL(
              "https://content.schwab.com/web/retail/public/about-schwab/schwab_annual_report_2025.pdf",
            )
          }
        >
          Read the source report ↗
        </Button>
      </Card>
      <Button secondary onPress={() => router.replace("/(tabs)/home")}>
        ← Back to Home
      </Button>
    </Screen>
  );
}
