import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import ButtonThemed from "@/components/DataInput/Button";
import { COOLORS } from "@/constants/theme";
import InputBar from "@/components/DataInput/InputBar";
import { addFriendToRoom } from "@/api/gathersSetters";
import MyTransparentModal from "@/components/Wraps/MyTransparentModal";
import ErrorBox from "@/components/DataInput/ErrorBox";
import ModalCard from "@/components/Wraps/ModalCard";

export default function AddFriendScreen() {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const { roomId } = useLocalSearchParams();

  const [userNick, setUserNick] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleAddingUser() {
    if (!userNick.trim()) {
      setError("Podaj nazwę znajomego");
      return;
    }
    Keyboard.dismiss()
    try {
      setError("");
      setCreating(true);

      await addFriendToRoom(roomId, userNick.trim());

      router.back();
    } catch (err) {
      setError(err.message || "Nie udało się dodać znajomego");
    } finally {
      setCreating(false);
    }
  }

  return (
    <MyTransparentModal
      backdropColor="#00000066"
      durationIn={700}
      durationOut={220}
      delayBackdrop={0.95}
      closeOnBackdropPress={true}
    >
      {/* <View style={styles.overlay}> */}
        <ModalCard
          style={[
            // styles.card,
            {
              backgroundColor: colors.surfaceContainerHigh,
            },
          ]}
        >
          <View style={styles.headerIcon}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: colors.secondaryContainer,
                },
              ]}
            >
              <Ionicons
                name="person-add-outline"
                size={24}
                color={colors.onSecondaryContainer}
              />
            </View>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.onSurface,
              },
            ]}
          >
            Dodaj znajomego
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          >
            Wpisz nazwę użytkownika, którego chcesz dodać do rachunku.
          </Text>

          <InputBar
            style={styles.inputBox}
            value={userNick}
            onChangeText={(text) => {
              setError("");
              setUserNick(text);
            }}
            icon="pencil"
            placeholder="Nazwa znajomego"
          />

          <ErrorBox message={error}/>
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
              onPress={handleAddingUser}
            />
          </View>
        </ModalCard>
      {/* </View> */}
    </MyTransparentModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 26,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,

    elevation: 8,
  },

  headerIcon: {
    alignItems: "center",
    marginBottom: 14,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 22,
    lineHeight: 18,
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

  errorText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  buttons: {
    flexDirection: "row",
    gap: 16,
  },
});