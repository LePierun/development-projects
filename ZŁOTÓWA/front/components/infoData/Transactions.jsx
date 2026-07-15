import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import Avatar from "./Avatar";
import { COOLORS } from "@/constants/theme";
import HorizontalDivider from "../HorizontalSplit";
import { generateColorFromId } from "@/constants/usersColors";
export default function Transaction({
  title = "Jedzenie",
  date = "25.08.2026",

  fromName = "Aleksander",
  toName = "Miłosz",
  amount = 38.59,
  transId = -1,
  ownerId,
  creditorId,
  borrowerId,
  isLast = false,
}) {



  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const isCreditor = creditorId === ownerId;
  const isBorrower = borrowerId === ownerId;
  const isMine = isCreditor || isBorrower;

  // const isSelfTransaction = creditorId === borrowerId;

  // if (isSelfTransaction) {
  //   return null;
  // }

  let amountColor = colors.onSurfaceVariant;
  let amountText = `${(Number(amount) || 0).toFixed(2)} zł`;

  if (isCreditor) {
    amountColor = colors.tertiary;
  } else if (isBorrower) {
    amountColor = colors.error;
    amountText = `-${(Number(amount) || 0).toFixed(2)} zł`;
  }

  return (
    <>
      <View
        style={[
          styles.container,
          !isMine && styles.neutral,
        ]}
      >

        <Avatar
          name={fromName}
          size={36}
          showLabel={true}
          userid={creditorId}
            proportion = {1.6}

          // backgroundColor={generateColorFromId(creditorId)}

          // textColor={colors.onPrimaryContainer}
        />

        <View style={styles.middle}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: colors.onSurface },
            ]}
          >
            {title}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.date,
              { color: colors.outline },
            ]}
          >
            {new Date(date)
              .toLocaleString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(",", "")}
          </Text>
        </View>

        <View style={styles.borrowerBox}>
          <Avatar
            name={toName}
            size={30}
            showLabel={true}
            userid={borrowerId}
            proportion = {1.6}

            // textColor={colors.onSecondaryContainer}

          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.amount,
            { color: amountColor },
          ]}
        >
          {amountText}
        </Text>
      </View>

      {!isLast && (
        <HorizontalDivider marginVertical={0} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // paddingTop: 2,
    // paddingTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  neutral: {
    opacity: 0.52,
    paddingVertical: -10,
  },

  middle: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
  },

  date: {
    fontSize: 11,
    marginTop: 3,
  },

  borrowerBox: {
    width: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  amount: {
    width: 86,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "800",
  },
});

