import { Tabs, Redirect } from "expo-router";
import { Icon } from "../../components/ui";
import { colors as c, fonts } from "../../components/theme";
import { useApp } from "../../state/AppState";
export default function TabsLayout() {
  const { ready, data } = useApp();
  if (!ready) return null;
  if (!data.profile) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.background,
          borderTopColor: c.border,
          height: 78,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icon name="grid-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bridge"
        options={{
          title: "Bridge",
          tabBarIcon: ({ color }) => (
            <Icon name="swap-horizontal-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="understand"
        options={{
          title: "Understand",
          tabBarIcon: ({ color }) => <Icon name="bulb-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Icon name="scan-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => <Icon name="book-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
