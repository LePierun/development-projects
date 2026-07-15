import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { createSingleTransaction } from "@/api/gathersSetters";
import { COOLORS } from "@/constants/theme";
import BottomSpacer from "@/components/Wraps/BottomSpacer";
import SplitAmountRow from "@/components/DataInput/SplitAmountRow";
import ButtonThemed from "@/components/DataInput/Button";
import MyTransparentModal from "@/components/Wraps/MyTransparentModal";
import ModalCard from "@/components/Wraps/ModalCard";

export default function ConfirmTransactionScreen() {
  const params = useLocalSearchParams();
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];
  const navi = useNavigation();

  const [waitButton, SetWaitButton] = useState(false)
  const roomId = params.currentRoomId;
  const totalAmount = Number(String(params.amount).replace(",", "."));
  const desc = params.desc || "";
  const selectedUsers = params.users ? JSON.parse(params.users) : [];

  const [splits, setSplits] = useState([]);

  useEffect(() => {
    if (!selectedUsers.length || !totalAmount) return;

    const perPerson = +(totalAmount / selectedUsers.length).toFixed(2);

    setSplits(
      selectedUsers.map((user) => ({
        id: user.U_ID_User,
        name: user.U_Name,
        amount: String(perPerson),
      }))
    );
  }, []);

  const currentSum = splits.reduce((sum, item) => {
    const value = Number(String(item.amount).replace(",", "."));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const difference = +(totalAmount - currentSum).toFixed(2);
  const isValid = Math.abs(difference) <= 0.01;

  function updateManualAmount(id, text) {
    const cleaned = text.replace(",", ".").replace(/[^0-9.]/g, "");

    setSplits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: cleaned } : item
      )
    );
  }

  function changeAmount(id, delta) {
    setSplits((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const value = Number(String(item.amount).replace(",", "."));
        const safeValue = isNaN(value) ? 0 : value;
        const next = Math.max(0, +(safeValue + delta).toFixed(2));

        return {
          ...item,
          amount: String(next),
        };
      })
    );
  }

  async function handleConfirm() {
    if (!isValid) return;
    console.log("handelConfirm");
    SetWaitButton(true)
    Keyboard.dismiss()
    try {
      for (const item of splits) {
        const value = Number(String(item.amount).replace(",", "."));

        if (value > 0) {
          await createSingleTransaction(roomId, value, desc, item.id);
        }
      }

    } catch (err) {
      alert(err.message || "Nie udało się dodać transakcji");
      SetWaitButton(false)

    }

    navi.pop(2);

  }

  return (
    <MyTransparentModal
      backdropColor="#00000066"
      durationIn={700}
      durationOut={220}
      closeOnBackdropPress={true}
      popingScrens={2}
    >
      <ModalCard style={styles.card}>
        <Text
          style={[
            styles.title,
            {
              color: colors.onSurface,
            },
          ]}
        >
          Dostosuj podział
        </Text>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.primaryContainer,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryLabel,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {desc || "Transakcja"}
          </Text>

          <Text
            style={[
              styles.summaryAmount,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            {totalAmount.toFixed(2)} zł
          </Text>
        </View>

        <ScrollView
          style={styles.usersScroll}
          contentContainerStyle={styles.usersScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {splits.map((item) => (
            <SplitAmountRow
              key={item.id}
              id={item.id}
              userid={item.id}
              name={item.name}
              amount={item.amount}
              totalAmount={totalAmount}
              onChangeAmount={updateManualAmount}
              onMinus={(id) => changeAmount(id, -1)}
              onPlus={(id) => changeAmount(id, 1)}
            />
          ))}
        </ScrollView>

        <Text
          style={[
            styles.diffText,
            {
              color: isValid ? colors.primary : colors.error,
            },
          ]}
        >
          {isValid
            ? "Podział poprawny"
            : difference > 0
              ? `Pozostało ${difference.toFixed(2)} zł`
              : `Za dużo o ${Math.abs(difference).toFixed(2)} zł`}
        </Text>

        <View style={styles.bottomButtons}>
          <View style={styles.confirmButtonBox}>
            <ButtonThemed
              title={waitButton ? "Rozliczanie..." :"Rozlicz"}
              onPress={handleConfirm}
              disabled={!isValid || waitButton}
              variant="primary"
              style={styles.confirmButton}
              textStyle={styles.confirmText}
            />
          </View>
        </View>

        {/* <BottomSpacer height={10} /> */}
      </ModalCard>
    </MyTransparentModal>
  );
}

const styles = StyleSheet.create({
  card: {
    // marginHorizontal: 20,
    maxWidth: 440,
    maxHeight: "88%",
    // padding: 20,
    // paddingBottom: 16,
    alignItems: "stretch",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },

  summaryBox: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  summaryLabel: {
    fontSize: 14,
  },

  summaryAmount: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },

  usersScroll: {
    maxHeight: 280,
  },

  usersScrollContent: {
    // paddingBottom: 16,/
  },

  diffText: {
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "700",
  },

  bottomButtons: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  confirmButtonBox: {
    width: "50%",
    height: 52,
  },

  confirmButton: {
    width: "100%",
    height: 52,
    minHeight: 52,
    maxHeight: 52,

    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },

  confirmText: {
    fontWeight: "800",
  },
});