import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COOLORS } from "@/constants/theme";

export default function RoomEmblem({
  title = "Tytuł elementu",
  date = "25.08.2026",
}) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  return (

    <View style={styles.content}>

      <View
        style={[
          styles.iconBox,
          {
            backgroundColor:
              colors.primaryContainer,
          },
        ]}
      >

        <Ionicons
          name="wallet-outline"
          size={20}
          color={colors.onPrimaryContainer}
        />

      </View>

      <View style={styles.left}>

        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: colors.onSurface,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.date,
            {
              color:
                colors.onSurfaceVariant,
            },
          ]}
        >
          {new Date(date).toLocaleDateString("PL")}
        </Text>

      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.outline}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  content: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  iconBox: {
    width: 46,
    height: 46,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  left: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  date: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },

});