import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import PaddedScreen from "@/components/Wraps/PaddedScreen";
import RoomEmblem from "@/components/infoData/RoomEmblem";
import { COOLORS } from "@/constants/theme";

import {
  gatherRooms,
  setActiveRoom,
} from "@/api/gathersSetters";

export default function RoomList() {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let isFetching = false;

      const refreshRooms = async (showLoading = false) => {
        if (isFetching) return;

        isFetching = true;

        if (showLoading) {
          setLoading(true);
        }

        await gatherRooms(
          (cachedRooms) => {
            if (!isActive) return;

            setRooms(cachedRooms || []);

            if (showLoading) {
              setLoading(false);
            }
          },
          (freshRooms) => {
            if (!isActive) return;

            setRooms(freshRooms || []);

            if (showLoading) {
              setLoading(false);
            }
          }
        );

        isFetching = false;
      };

      refreshRooms(true);

      const interval = setInterval(() => {
        refreshRooms(false);
      }, 500);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [])
  );

  return (
    <PaddedScreen backgroundColor={colors.background}>
      <View style={styles.headerBox}>
        <Text style={[styles.header, { color: colors.onBackground }]}>
          Rachunki
        </Text>

        <View
          style={[
            styles.countChip,
            { backgroundColor: colors.secondaryContainer },
          ]}
        >
          <Text
            style={[
              styles.countText,
              { color: colors.onSecondaryContainer },
            ]}
          >
            {rooms.length}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading && rooms.length === 0 ? (
          <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>
            Ładowanie...
          </Text>
        ) : rooms.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.surfaceContainerHigh },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              Brak rachunków
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                { color: colors.onSurfaceVariant },
              ]}
            >
              Utwórz pierwszy rachunek, żeby zacząć dzielić wydatki.
            </Text>
          </View>
        ) : (
          rooms.map((room) => (
            <Pressable
              key={room.R_ID_Room}
              style={({ pressed }) => [
                styles.roomCard,
                {
                  backgroundColor: colors.surfaceContainerHigh,
                  opacity: pressed ? 0.78 : 1,
                },
              ]}
              onPress={() => {
                setActiveRoom(room.R_ID_Room);

                router.push({
                  pathname: "/DashBoard",
                  params: {
                    roomId: room.R_ID_Room,
                  },
                });
              }}
            >
              <RoomEmblem
                title={room.R_Name}
                date={room.R_Date_created}
              />
            </Pressable>
          ))
        )}
      </ScrollView>
    </PaddedScreen>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    marginTop: 20,
    marginBottom: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: {
    fontSize: 34,
    fontWeight: "800",
  },

  countChip: {
    minWidth: 42,
    height: 34,
    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 12,
  },

  countText: {
    fontSize: 15,
    fontWeight: "700",
  },

  scroll: {
    paddingBottom: 120,
    gap: 10,
  },

  roomCard: {
    borderRadius: 24,
    overflow: "hidden",
  },

  message: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
    fontWeight: "500",
  },

  emptyCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  emptySubtitle: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
});