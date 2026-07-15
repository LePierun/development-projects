import { COOLORS } from "@/constants/theme";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NavArea({ childrenStart, childrenCenter, childrenEnd, style}) {

    const scheme = useColorScheme();
    const colors = COOLORS[scheme ?? "dark"];
      
    const insets = useSafeAreaInsets();
    return(
    <View style={[styles.area,{bottom: insets.bottom},style]} pointerEvents={"box-none"}>
        <View style={styles.center} pointerEvents={"box-none"}>

          <View style={styles.parter} pointerEvents="box-none">{childrenStart}</View>
          <View style={[styles.parter,styles.parterCenter]} pointerEvents="box-none">{childrenCenter}</View>
          <View style={styles.parter} pointerEvents="box-none">{childrenEnd}</View>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parter:{
    minWidth:"30%",
    justifyContent:"center",
    alignItems: "center",
    // borderWidth:1,
  },
  parterCenter:{
    minWidth:"60%",
    
  },
  area: {
    // marginTop:20,
        position:"absolute",
        display:"flex",
        paddingHorizontal:70,
        // borderWidth:1,
        // flex: 1,
        // height: "100%",
        // height: 70,
        width: "100%",
        marginBottom: 16,
        // bottom: 0,
        zIndex: 100,
        // left:0,
        // justifyContent: "flex-end",
        // paddingBottom: 32,
    },
  center: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    gap: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  start: {
    // position: "absolute",
    // left: 30,
    // top: 0,
    // bottom: 0,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  end: {
    // position: "absolute",
    // right: 30,
    // top: 0,
    // bottom: 0,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});