import { useState } from "react";
import { Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Screen,
  Copy,
  Card,
  Label,
  Button,
  Input,
  Icon,
  Notice,
} from "../../components/ui";
import { colors as c } from "../../components/theme";
import { examples } from "../../services/offline";
export default function Scan() {
  const [uri, setUri] = useState(""),
    [text, setText] = useState(""),
    [error, setError] = useState(""),
    [sample, setSample] = useState(false);
  async function pick(camera: boolean) {
    setError("");
    try {
      if (camera) {
        const p = await ImagePicker.requestCameraPermissionsAsync();
        if (!p.granted) {
          setError(
            "Camera access was not granted. You can choose a photo or paste text instead.",
          );
          return;
        }
      }
      const r = await (camera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          }));
      if (!r.canceled) {
        setUri(r.assets[0].uri);
        setText("");
        setSample(false);
      }
    } catch {
      setError(
        "The camera or photo library is unavailable here. Paste text or use the sample document.",
      );
    }
  }
  return (
    <Screen
      kicker="FROM THE PAGE TO UNDERSTANDING"
      title="See it. Understand it."
    >
      <Copy>A report, a slide, a sentence you want to unpack.</Copy>
      <Card
        style={{
          backgroundColor: c.blueWash,
          minHeight: 240,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {uri ? (
          <Image
            accessibilityLabel="Selected document"
            source={{ uri }}
            style={{ width: "100%", height: 220, borderRadius: 14 }}
          />
        ) : (
          <View style={{ alignItems: "center", gap: 18 }}>
            <Icon name="scan-outline" size={68} />
            <Copy>Bring your business text into focus.</Copy>
          </View>
        )}
      </Card>
      <Button onPress={() => pick(true)}>Take a photo</Button>
      <Button secondary onPress={() => pick(false)}>
        Choose an image
      </Button>
      <Notice>
        Photo selection is working. Automatic text extraction is not connected
        yet. Paste the text below, or use the sample document.
      </Notice>
      <Button
        secondary
        onPress={() => {
          setText(examples.understand.English);
          setSample(true);
          setUri("");
        }}
      >
        Try a sample document
      </Button>
      <Label>
        {sample
          ? "SAMPLE TEXT · NOT EXTRACTED FROM A PHOTO"
          : "PASTE OR TYPE YOUR DOCUMENT TEXT"}
      </Label>
      <Input
        accessibilityLabel="Document text"
        multiline
        maxLength={5000}
        value={text}
        onChangeText={setText}
        placeholder="Paste the sentence you’d like to understand…"
      />
      {error && <Notice error>{error}</Notice>}
      <Button
        disabled={!text.trim()}
        onPress={() =>
          router.push({ pathname: "/(tabs)/understand", params: { text } })
        }
      >
        Explain with Lexicon →
      </Button>
    </Screen>
  );
}
