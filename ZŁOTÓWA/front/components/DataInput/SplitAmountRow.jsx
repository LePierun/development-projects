import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

import { COOLORS } from "@/constants/theme";
import Avatar from "../infoData/Avatar";

export default function SplitAmountRow({
  id,
  name = "Nieznany",
  userid,
  amount = "0",
  totalAmount = 0,
  onChangeAmount,
  onMinus,
  onPlus,
}) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const numeric = Number(String(amount).replace(",", "."));
  const percent =
    totalAmount > 0 && !isNaN(numeric)
      ? (numeric / totalAmount) * 100
      : 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainer },
      ]}
    >
      <View style={styles.leftSection}>
        <Avatar name={name} size={46} showLabel={false} userid={userid} />

        <View style={styles.infoBox}>
          <Text style={[styles.name, { color: colors.onSurface }]}>
            {name}
          </Text>

          <Text style={[styles.status, { color: colors.onSurfaceVariant }]}>
            {percent.toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          style={[
            styles.smallButton,
            { backgroundColor: colors.secondaryContainer },
          ]}
          onPress={() => onMinus?.(id)}
        >
          <Ionicons name="remove" size={18} color={colors.onSecondaryContainer} />
        </Pressable>

        <TextInput
          style={[
            styles.amountInput,
            {
              backgroundColor: colors.surfaceContainerHighest,
              color: colors.primary,
            },
          ]}
          value={String(amount)}
          keyboardType="decimal-pad"
          onChangeText={(text) => onChangeAmount?.(id, text)}
        />

        <Text style={[styles.currency, { color: colors.primary }]}>zł</Text>

        <Pressable
          style={[
            styles.smallButton,
            { backgroundColor: colors.secondaryContainer },
          ]}
          onPress={() => onPlus?.(id)}
        >
          <Ionicons name="add" size={18} color={colors.onSecondaryContainer} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 18,
    marginBottom: 10,
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 8,
  },

  infoBox: {
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  status: {
    fontSize: 12,
    marginTop: 2,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  smallButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  amountInput: {
    width: 72,
    height: 38,
    borderRadius: 12,
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },

  currency: {
    fontSize: 13,
    fontWeight: "700",
  },
});