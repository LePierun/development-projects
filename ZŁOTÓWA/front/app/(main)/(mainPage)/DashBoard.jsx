import { Text, useColorScheme, View, ScrollView, StyleSheet } from "react-native";
import { COOLORS } from "@/constants/theme";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import PaddedScreen from "@/components/Wraps/PaddedScreen";
import FriendOwningEmblem from "@/components/infoData/FriendOwningEmblem";
import BottomSpacer from "@/components/Wraps/BottomSpacer";
import { Pressable } from "react-native";
import {
  gatherRoom,
  gatherTransactions,
  getActiveRoom,
  setActiveRoom,
  getCurrentUserId,
} from "@/api/gathersSetters";
import HorizontalDivider from "@/components/HorizontalSplit";

export default function DashBoard({ changeHeader }) {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const { roomId } = useLocalSearchParams();

  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [usersInfo, setUsersInfo] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  function applyRoomData(data) {
    if (!data) return;

    setRoomInfo(data.room || null);
    setUsersInfo(data.users || []);

    if (data.room?.R_Name) {
      changeHeader?.(data.room.R_Name);
    }
  }

  useEffect(() => {

    if (roomId) {
      gatherTransactions(roomId);
    }
  }, []);

  async function loadDashboardData(id) {
    if (!id) return;

    setLoading(true);

    try {
      await gatherRoom(
        id,
        (cached) => applyRoomData(cached),
        (fresh) => applyRoomData(fresh)
      );

      await gatherTransactions(
        id,
        (cached) => setTransactions(cached || []),
        (fresh) => setTransactions(fresh || [])
      );
    } catch (err) {
      console.log("Błąd dashboard:", err.message);
      router.replace("/(reglog)/Login");
    } finally {
      setLoading(false);
    }
  }



  useFocusEffect(
    useCallback(() => {
      const id = roomId || getActiveRoom();

      if (!id) {
        router.replace("/(list)/RoomList");
        return; 
      }

      setActiveRoom(id);
      setCurrentRoomId(id);
      loadDashboardData(id);

      const interval = setInterval(() => {
        loadDashboardData(id);
        
      }, 500);

      return () => clearInterval(interval);
    }, [roomId])
  );



  const balance = usersInfo.reduce((sum, user) => {
    return sum + Number(user.balance || 0);
  }, 0);

  const balanceColor =
    balance < 0
      ? colors.error
      : balance > 0
        ? colors.primary
        : colors.onSurfaceVariant;

  return (
    <PaddedScreen backgroundColor={colors.background}>
      <View style={styles.topSpacer} />

      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.primaryContainer,
            shadowColor: colors.shadow || "#000",
          },
        ]}
      >
        <View style={styles.balanceTextBox}>
          <Text
            style={[
              styles.balanceLabel,
              {
                color: colors.primary,
              },
            ]}
          >
            Bilans
          </Text>

          <Text
            style={[
              styles.balanceAmount,
              {
                color: balanceColor,
              },
            ]}
          >
            {balance.toFixed(2)} zł
          </Text>
        </View>

        <Pressable
          onPress={() => {
            router.push({
              pathname: "(main)/AddFriendScreen",
              params: {
                roomId: String(currentRoomId),
              },
            });
          }}
          style={({ pressed }) => [
            styles.addFriendButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons
            name="person-add"
            size={22}
            color={colors.onPrimary}
          />
        </Pressable>
      </View>

      <HorizontalDivider marginVertical={16} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {usersInfo.map((item) => (
          <FriendOwningEmblem
            key={item.U_ID_User}
            userid={item.U_ID_User}
            name={item.U_Name}
            amount={item.balance}
          />
        ))}

        <BottomSpacer />
      </ScrollView>
    </PaddedScreen>
  );
}

const styles = StyleSheet.create({
  topSpacer: {
    height: 16,
  },

  balanceCard: {
    borderRadius: 24,
    padding: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 16,

    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,

    elevation: 2,
  },

  balanceTextBox: {
    flex: 1,
  },

  balanceLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.85,
  },

  balanceAmount: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },

  balanceHint: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },

  addFriendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    flex: 1,
  },
});