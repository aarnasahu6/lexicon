import { Redirect } from "expo-router";
import { useApp } from "../state/AppState";
import { Screen, Notice } from "../components/ui";
export default function Index() {
  const { ready, data, error } = useApp();
  if (!ready)
    return (
      <Screen>
        <Notice>Opening Lexicon…</Notice>
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <Notice error>{error}</Notice>
      </Screen>
    );
  return <Redirect href={data.profile ? "/(tabs)/home" : "/onboarding"} />;
}
