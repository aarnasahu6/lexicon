import React from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors as c, fonts as f } from "./theme";
export function Copy({
  children,
  style,
  ...rest
}: React.ComponentProps<typeof Text>) {
  return (
    <Text {...rest} style={[s.copy, style]}>
      {children}
    </Text>
  );
}
export function Heading({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  return (
    <Text accessibilityRole="header" style={[s.heading, style]}>
      {children}
    </Text>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <Copy style={s.label}>{children}</Copy>;
}
export function Icon({
  name,
  size = 22,
  color = c.primary,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Button({
  children,
  onPress,
  secondary,
  disabled,
  busy,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (disabled || busy) && { opacity: 0.55 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? c.primary : c.background} />
      ) : (
        <Copy
          style={{
            fontFamily: f.medium,
            color: secondary ? c.primary : c.background,
            textAlign: "center",
          }}
        >
          {children}
        </Copy>
      )}
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Screen({
  children,
  title,
  kicker,
  action,
}: {
  children: React.ReactNode;
  title?: string;
  kicker?: string;
  action?: React.ReactNode;
}) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.safe}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.container}
      >
        <View style={s.brand}>
          <Text style={s.logo}>Lexicon</Text>
          {action || <Copy style={s.micro}>YOUR LANGUAGE, AT WORK</Copy>}
        </View>
        {kicker && <Label>{kicker}</Label>}
        {title && <Heading>{title}</Heading>}
        {children}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
export function Choices<T extends string>({
  values,
  value,
  onChange,
}: {
  values: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={s.wrap}>
      {values.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={[s.chip, value === item && s.chipSelected]}
        >
          <Copy
            style={{
              fontSize: 14,
              color: value === item ? c.background : c.primary,
            }}
          >
            {item}
          </Copy>
        </Pressable>
      ))}
    </View>
  );
}
export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={c.muted}
      {...props}
      style={[
        s.input,
        props.multiline && { height: 155, textAlignVertical: "top" },
        props.style,
      ]}
    />
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[s.notice, error && { backgroundColor: "#F9E9E4" }]}
    >
      <Copy style={{ fontSize: 14, color: error ? c.danger : c.muted }}>
        {children}
      </Copy>
    </View>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background },
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 20,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  copy: { fontFamily: f.body, color: c.text, fontSize: 16, lineHeight: 24 },
  heading: {
    fontFamily: f.heading,
    color: c.primary,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.6,
  },
  label: {
    fontSize: 12,
    letterSpacing: 2,
    color: c.muted,
    fontFamily: f.medium,
    lineHeight: 20,
  },
  micro: { fontSize: 10, letterSpacing: 1.5, color: c.muted },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 8,
  },
  logo: { fontFamily: f.logo, color: c.primary, fontSize: 44 },
  button: {
    backgroundColor: c.primary,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 20,
    minHeight: 54,
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: c.secondary,
    borderColor: c.border,
    borderWidth: 1,
  },
  card: {
    backgroundColor: c.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.border,
    padding: 22,
    gap: 12,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
  },
  chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
  input: {
    backgroundColor: c.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: c.border,
    fontSize: 16,
    lineHeight: 25,
    color: c.text,
    fontFamily: f.body,
    ...Platform.select({ web: { outlineColor: c.primary } as object }),
  },
  notice: { backgroundColor: c.blueWash, borderRadius: 14, padding: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});
