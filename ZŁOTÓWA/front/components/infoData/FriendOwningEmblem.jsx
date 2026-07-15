import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { COOLORS } from "@/constants/theme";
import Avatar from "./Avatar";

export default function FriendOwningEmblem({
  name = "Nieznany",
  amount = 0,
  userid,
}) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const numericAmount = Number(amount) || 0;

  const isPositive = numericAmount > 0;
  const isNegative = numericAmount < 0;
  const isEven = numericAmount === 0;

  const statusText = isEven
    ? "Jesteście rozliczeni"
    : isPositive
      ? "Jest Ci winny"
      : "Jesteś winny";

  const amountColor = isEven
    ? colors.onSurfaceVariant
    : isPositive
      ? colors.tertiary
      : colors.error;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceVariant,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Avatar
          name={name}
          size={46}
          showLabel={false}
          userid={userid}
        />

        <View style={styles.infoBox}>
          <Text
            style={[
              styles.name,
              {
                color: colors.onSurface,
              },
            ]}
          >
            {name}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: colors.onSurfaceVariant,
              },
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: amountColor,
          },
        ]}
      >
        {Math.abs(numericAmount).toFixed(2)} zł
      </Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
});