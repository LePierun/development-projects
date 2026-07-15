import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import ButtonThemed from "@/components/DataInput/Button";
import { COOLORS } from "@/constants/theme";
import InputBar from "@/components/DataInput/InputBar";
import { createRoom } from "@/api/gathersSetters";
import MyTransparentModal from "@/components/Wraps/MyTransparentModal";
import ErrorBox from "@/components/DataInput/ErrorBox";
import ModalCard from "@/components/Wraps/ModalCard";
import BottomSpacer from "@/components/Wraps/BottomSpacer";

export default function AddRoomScreen() {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleAddingRoom() {
    if (!roomName.trim()) {
      setError("Podaj nazwę rachunku");
      return;
    }
    Keyboard.dismiss()
    
    try {
      setError("");
      setCreating(true);

      await createRoom(roomName.trim());

      router.back();
    } catch (err) {
      setError(err.message || "Nie udało się dodać rachunku");
    } finally {
      setCreating(false);
    }
  }

  return (
    <MyTransparentModal
      backdropColor="#00000066"
      durationIn={400}
      durationOut={80}
      closeOnBackdropPress={true}
    >
      <ModalCard style={styles.card}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: colors.primaryContainer,
            },
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={26}
            color={colors.onPrimaryContainer}
          />
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.onSurface,
            },
          ]}
        >
          Dodaj rachunek
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.onSurfaceVariant,
            },
          ]}
        >
          Nazwij nowy rachunek, żeby łatwo odnaleźć go na liście.
        </Text>

        <InputBar
          style={styles.inputBox}
          value={roomName}
          onChangeText={(text) => {
            setError("");
            setRoomName(text);
          }}
          icon="pencil"
          placeholder="Nazwa rachunku"
        />

        <ErrorBox message={error} style={styles.errorBox} />

        <View style={styles.buttons}>
          <ButtonThemed
            title="Anuluj"
            variant="secondary"
            onPress={() => router.back()}
          />

          <ButtonThemed
            title={creating ? "Dodawanie..." : "Dodaj"}
            variant="primary"
            disabled={creating}
            onPress={handleAddingRoom}
          />
        </View>
      </ModalCard>
        <BottomSpacer/>
    </MyTransparentModal>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    // paddingVertical: 28,
    alignItems: "stretch",
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 22,
  },

  inputBox: {
    marginBottom: 14,
  },

  errorBox: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  buttons: {
    flexDirection: "row",
    gap: 16,
  },
});