import { Pressable, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Copy,
  Label,
  Card,
  Heading,
  Icon,
  s,
  Notice,
} from "../../components/ui";
import { colors as c, fonts as f } from "../../components/theme";
import { useApp } from "../../state/AppState";
const actions = [
  {
    name: "Bridge",
    path: "bridge",
    icon: "swap-horizontal-outline",
    text: "Your words. A professional voice.",
    detail: "Turn everyday language into finance language.",
  },
  {
    name: "Understand",
    path: "understand",
    icon: "bulb-outline",
    text: "Make the complicated click.",
    detail: "Unpack financial language, one idea at a time.",
  },
  {
    name: "Scan",
    path: "scan",
    icon: "scan-outline",
    text: "From the page to understanding.",
    detail: "Bring a document into your learning.",
  },
  {
    name: "Learn",
    path: "learn",
    icon: "book-outline",
    text: "Make the words yours.",
    detail: "Build a vocabulary that grows with you.",
  },
] as const;
export default function Home() {
  const { data, error } = useApp();
  return (
    <Screen
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Learning preferences"
          onPress={() => router.push("/settings")}
          style={{ padding: 12 }}
        >
          <Icon name="options-outline" />
        </Pressable>
      }
      kicker={`${data.profile?.field.toUpperCase()} · ${data.profile?.language.toUpperCase()}`}
      title="What do you want to do?"
    >
      <Copy>A little more clarity. A lot more confidence.</Copy>
      <View style={{ gap: 12 }}>
        {actions.map((a, i) => (
          <Pressable
            key={a.path}
            accessibilityRole="button"
            accessibilityLabel={a.name}
            onPress={() => router.push(`/(tabs)/${a.path}`)}
          >
            <Card
              style={{
                backgroundColor: i === 0 ? c.primary : c.white,
                padding: 22,
              }}
            >
              <View style={s.row}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 13,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name={a.icon}
                    color={i === 0 ? c.secondary : c.primary}
                  />
                  <Heading
                    style={{
                      fontSize: 30,
                      lineHeight: 34,
                      color: i === 0 ? c.background : c.primary,
                    }}
                  >
                    {a.name}
                  </Heading>
                </View>
                <Icon
                  name="arrow-forward"
                  color={i === 0 ? c.background : c.primary}
                />
              </View>
              <Copy
                style={{
                  color: i === 0 ? c.background : c.text,
                  fontFamily: f.medium,
                }}
              >
                {a.text}
              </Copy>
              <Copy
                style={{ color: i === 0 ? "#DCE7EF" : c.muted, fontSize: 14 }}
              >
                {a.detail}
              </Copy>
            </Card>
          </Pressable>
        ))}
      </View>
      <Card style={{ backgroundColor: c.secondary }}>
        <Label>YOUR GROWING VOCABULARY</Label>
        <View style={s.row}>
          <Heading style={{ fontSize: 32 }}>
            {data.saved.length} words saved
          </Heading>
          <Copy>{data.saved.filter((x) => x.learned).length} learned</Copy>
        </View>
      </Card>
      <Label>RECENT ACTIVITY</Label>
      {!data.history.length ? (
        <Copy style={{ color: c.muted }}>
          Your first discovery starts with Bridge. It will appear here.
        </Copy>
      ) : (
        data.history.slice(0, 3).map((h) => (
          <Pressable
            accessibilityRole="button"
            key={h.id}
            onPress={() =>
              router.push({
                pathname: ("/(tabs)/" + h.action_type) as "/(tabs)/bridge",
                params: { historyId: h.id },
              })
            }
          >
            <Card>
              <Label>
                {h.action_type} · {new Date(h.created_at).toLocaleDateString()}
              </Label>
              <Copy numberOfLines={2}>{h.input_text}</Copy>
            </Card>
          </Pressable>
        ))
      )}
      {error && <Notice error>{error}</Notice>}
    </Screen>
  );
}
