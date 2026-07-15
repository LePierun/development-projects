import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { COOLORS } from "@/constants/theme";
import { generateColorFromId } from "@/constants/usersColors";

export default function Avatar({
  name = "A",
  size = 40,
  forceCustomName,
  backgroundColor,
  textColor,
  userid,
  showLabel = true,
  proportion = 1,
  style,
}) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const letter =
    name?.[0]?.toUpperCase() || "?";

  const finalBackground = generateColorFromId(userid) ||
    backgroundColor ||
    colors.primaryContainer;

  const finalTextColor =
    textColor ||
    "white";

  return (

    <View
      style={[
        styles.container,

        {
          width: showLabel ? size * 1.7 : size * proportion,
          minHeight: showLabel ? size * 1.7 : size * proportion,
        },

        style,
      ]}
    >

      <View
        style={[
          styles.avatar,

          {
            width: size,
            height: size,

            borderRadius: size / 2,

            backgroundColor:
              finalBackground,
          },
        ]}
      >

        <Text
          style={[
            styles.avatarText,

            {
              fontSize: size * 0.4,
              color: finalTextColor,
            },
          ]}
        >
          {letter}
        </Text>

      </View>

      {showLabel && (

        <Text
          numberOfLines={1}
          style={[
            styles.label,

            {
              fontSize: size * 0.28,
              color: colors.onSurfaceVariant,
              maxWidth: size * 1.8,
            },
          ]}
        >
          {forceCustomName || name}
        </Text>

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    // borderWidth:1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontWeight: "800",
  },

  label: {
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },

});