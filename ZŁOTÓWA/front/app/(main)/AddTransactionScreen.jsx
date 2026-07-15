import PaddedScreen from "@/components/Wraps/PaddedScreen";
import CardThemed from "@/components/CardThemed";
import InputBar from "@/components/DataInput/InputBar";
import Avatar from "@/components/infoData/Avatar";

import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  useColorScheme,
  Keyboard,
} from "react-native";

import ButtonThemed from "@/components/DataInput/Button";
import HorizontalDivider from "@/components/HorizontalSplit";
import Toggle from "@/components/DataInput/Toogle";
import { useCallback, useState } from "react";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  createTransaction,
  gatherRoom,
  getActiveRoom,
  getCurrentUser,
} from "@/api/gathersSetters";

import { COOLORS } from "@/constants/theme";
import MyTransparentModal from "@/components/Wraps/MyTransparentModal";

export default function AddTransactionScreen() {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const [friends, setFriends] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentRoomId = getActiveRoom();
  const equalSplit = selectedUsers.length;
  const currentUser = getCurrentUser();

  function addMeToUsers(users = []) {
    if (!currentUser?.id) return users;

    const meObject = {
      U_ID_User: currentUser.id,
      U_Name: currentUser.name,
      color: colors.primary,
    };

    const usersWithoutMe = users.filter(
      (user) => user.U_ID_User !== currentUser.id
    );

    return [meObject, ...usersWithoutMe];
  }

  async function loadRoomUsers() {
    if (!currentRoomId) {
      router.back();
      return;
    }

    await gatherRoom(
      currentRoomId,
      (cached) => setFriends(addMeToUsers(cached?.users || [])),
      (fresh) => setFriends(addMeToUsers(fresh?.users || []))
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadRoomUsers();
    }, [currentRoomId])
  );

  function toggleUser(userId) {
    setError("");

    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function handleAmountChange(text) {
    setError("");

    const cleaned = text
      .replace(",", ".")
      .replace(/[^0-9.]/g, "");

    const dots = cleaned.match(/\./g);

    if (dots && dots.length > 1) return;

    setAmount(cleaned);
  }

  function handleDescChange(text) {
    setError("");
    setDesc(text.slice(0, 32));
  }

  function handleVerification(nextAction) {
    setError("");

    const parsedAmount = Number(amount.replace(",", "."));

    if (!amount.trim()) {
      setError("Podaj kwotę");
      return;
    }

    if (isNaN(parsedAmount)) {
      setError("Kwota musi być liczbą");
      return;
    }

    if (parsedAmount <= 0) {
      setError("Kwota musi być większa od zera");
      return;
    }

    if (desc.length > 32) {
      setError("Opis może mieć maksymalnie 32 znaki");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Wybierz przynajmniej jedną osobę");
      return;
    }

    nextAction?.();
  }

  async function handleEqualSplit() {
    const parsedAmount = Number(amount.replace(",", "."));

    try {
      setLoading(true);

      await createTransaction(
        currentRoomId,
        parsedAmount,
        desc.trim(),
        selectedUsers
      );

      router.back();
    } catch (err) {
      setError(err.message || "Nie udało się dodać transakcji");
    } finally {
      setLoading(false);
    }
  }

  function handleForword() {
    const selectedUsersData = friends.filter((user) =>
      selectedUsers.includes(user.U_ID_User)
    );
    Keyboard.dismiss()
    
    router.push({
      pathname: "/ConfirmTransactionScreen",
      params: {
        currentRoomId,
        amount,
        desc,
        users: JSON.stringify(selectedUsersData),
      },
    });
  }

  return (
    <MyTransparentModal
      backdropColor="#00000066"
      durationIn={700}
      durationOut={220}
      delayBackdrop={0.95}
      closeOnBackdropPress={true}
    >
      <PaddedScreen style={styles.screen}>
        <CardThemed
          type="surface"
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerHigh,
            },
          ]}
        >
          <View style={styles.topAmountArea}>
            <View style={styles.amountWrapper}>
              <View style={{ flex: 1 }}>
                <InputBar
                  icon="cash-outline"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={handleAmountChange}
                  style={styles.amountInput}
                />
              </View>

              <Text
                style={[
                  styles.currencyLabel,
                  {
                    color: colors.onSurface,
                  },
                ]}
              >
                zł
              </Text>
            </View>

            <InputBar
              icon="create-outline"
              placeholder="Opis"
              value={desc}
              maxLength={32}
              onChangeText={handleDescChange}
              style={styles.descInput}
            />

            <Text
              style={[
                styles.descCounter,
                {
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              {desc.length}/32
            </Text>

            {error ? (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: colors.errorContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: colors.onErrorContainer,
                    },
                  ]}
                >
                  {error}
                </Text>
              </View>
            ) : null}
          </View>

          <HorizontalDivider />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.onSurface,
              },
            ]}
          >
            Wybierz osoby
          </Text>

          <View style={styles.gridOuter}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridScroll}
            >
              <View style={styles.gridInner}>
                {friends.map((item) => (
                  <View key={item.U_ID_User} style={styles.gridItem}>
                    <Toggle
                      value={selectedUsers.includes(item.U_ID_User)}
                      onEnable={() => toggleUser(item.U_ID_User)}
                      onDisable={() => toggleUser(item.U_ID_User)}
                    >
                      <Avatar
                        name={item.U_Name}
                        size={46}
                        forceCustomName={
                          currentUser?.id === item.U_ID_User ? "Ja" : undefined
                        }
                        userid={item.U_ID_User}
                        backgroundColor={item.color || colors.primary}
                      />
                    </Toggle>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <Text
            style={[
              styles.splitText,
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          >
            Podział na: {equalSplit} osób
          </Text>

          <View style={styles.buttonRow}>
            <ButtonThemed
              title="Podziel równo"
              variant="secondary"
              disabled={loading}
              onPress={() => handleVerification(handleEqualSplit)}
            />

            <ButtonThemed
              title="Specjalny podział"
              variant="primary"
              disabled={loading}
              onPress={() => handleVerification(handleForword)}
            />
          </View>
        </CardThemed>
      </PaddedScreen>
    </MyTransparentModal>
  );
}

const styles = StyleSheet.create({
  topAmountArea: {
    flexDirection: "column",
  },

  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  amountInput: {
    fontSize: 34,
    marginBottom: 12,
  },

  currencyLabel: {
    fontSize: 34,
    fontWeight: "700",
  },

  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  card: {
    padding: 20,
    gap: 12,
    borderRadius: 28,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,

    elevation: 10,
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
  },

  gridOuter: {
    width: "100%",
    maxHeight: 240,
    alignItems: "center",
    overflow: "visible",
  },

  gridScroll: {
    alignItems: "center",
    paddingVertical: 4,
  },

  gridInner: {
    width: 340,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  gridItem: {
    width: 85,
    alignItems: "center",
    paddingVertical: 6,
  },

  splitText: {
    textAlign: "center",
    fontSize: 13,
  },

  inputs: {
    gap: 8,
  },

  descCounter: {
    textAlign: "right",
    fontSize: 12,
  },

  footerArea: {
    position: "relative",
    gap: 8,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },

  errorContainer: {
    alignSelf: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },

  errorText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
});