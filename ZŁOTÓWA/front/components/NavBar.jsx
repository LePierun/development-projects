import { COOLORS } from "@/constants/theme";
import { StyleSheet, useColorScheme } from "react-native";
import NavArea from "./navComponents/navArea";
import NavBackButton from "./navComponents/navBackButton";
import NavSlider from "./navComponents/navSlider";
export default function NavBar({ state,navigation }) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];
  
  // const translateX = useRef(new Animated.Value(0)).current;
  
  // useEffect(() => {
  //   Animated.spring(translateX, {
  //     toValue: state.index * style.nav.width/state.routes.length,
  //     useNativeDriver: true,
  //   }).start();
  // }, [state.index,translateX]);

  return (
    <NavArea
      childrenStart = {<NavBackButton navigation={navigation}></NavBackButton>}
      childrenCenter = {<NavSlider state = {state} navigation={navigation}></NavSlider>}
      // childrenEnd = {<FabButton />}
    
    ></NavArea>
  );
}
const style=StyleSheet.create({

  container: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",

    width: 150,
    height: 64,

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 22,
    elevation: 8,
    overflow: "hidden",
  },

  activeBox: {
    position: "absolute",
    left: 7,
    width: 61,
    height: 54,
    borderRadius: 18,
    top: 5,
    
  },

  button: {
    width: 75,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
  width: 44,
  height: 44,
  position: "absolute",
  borderRadius: 14,
  left: 13,
  justifyContent: "center",
  alignItems: "center",

  elevation: 6,
  },
});
