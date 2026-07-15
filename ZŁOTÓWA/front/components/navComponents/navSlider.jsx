import { COOLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
// import NavS


export default function NavSlider({ state, navigation }) {

  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];
  
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!state) return;

    Animated.spring(translateX, {
      toValue: state.index * style.nav.width / state.routes.length,
      useNativeDriver: true,
    }).start();
  }, [state?.index, translateX]);

  return (


        <View
        style={[
            style.nav,
            { backgroundColor: colors.surfaceContainerHigh }
        ]}
        >
        <Animated.View
            style={[
            style.activeBox,
            {
                backgroundColor: colors.primaryContainer,
                transform: [{ translateX }],
            },
            ]}
        />

        <Pressable style={style.button}
            onPress={() => navigation.navigate("DashBoard")}>
            
            <Ionicons name="bag-add" size={26} color={colors.onSurface} />
        </Pressable>

        <Pressable style={style.button}
            onPress={ () => navigation.navigate("History")}>
            <Ionicons name="time-outline" size={26} color={colors.onSurface} />
        
        </Pressable>
        </View>

  )
}

const style = StyleSheet.create({
 nav:{
    // position: "absolute",
    // bottom: 28,
    alignSelf: "center",
    width: 150,
    height: 64,
    
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    
    borderRadius: 22,
    // borderWidth: 1,
    
    // shadowOpacity: 0.18,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  // container: {
  //   position: "absolute",
  //   bottom: 28,
  //   alignSelf: "center",

  //   // width: 150,
  //   height: 64,

  //   flexDirection: "row",
  //   alignItems: "center",

  //   borderRadius: 22,
  //   elevation: 8,
  //   overflow: "hidden",
  // },

  activeBox: {
    position: "absolute",
    left: 7,
    width: 61,
    height: 54,
    borderRadius: 18,
    top: 5,
    
  },



})