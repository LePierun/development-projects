import { StyleSheet, Text, View } from "react-native";

export default function Avatar({
  name = "A",
  size = 40,
  backgroundColor = "#965b1f",
  textColor = "white",
  showLabel = true,
  style,
}) {
  const letter = name?.[0]?.toUpperCase() || "?";

  return (
    
    <View style={[
        styles.contener,
        {
          width: size*1.6,
          height: size*1.6
        },
        style]}>
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
        <Text
          style={[
            styles.text,
            {
              fontSize: size * 0.4,
              color: textColor,
            },
          ]}
        >
          {letter}
        </Text>

    </View>
        {showLabel && (
            <Text style={{fontSize: size * 0.3}}>{name}</Text>
        )}
    </View>
    



  );
}

const styles = StyleSheet.create({

    contener: {
        alignItems: "center",
        justifyContent: "center",
        // gap: 2,
        // minWidth: "100%",
        // borderWidth:1
        // padding: 12,
    },
    avatar: {
        // width: 40,
        // height: 40,
        // borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        // width:"100%", 
        fontWeight: "700",
    },
});