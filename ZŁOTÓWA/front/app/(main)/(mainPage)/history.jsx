import PaddedScreen from "@/components/Wraps/PaddedScreen";
import { COOLORS } from "@/constants/theme";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HistoryList from "@/components/HistoryList";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  gatherTransactions,
  getActiveRoom,
  getChashedTransactions,
  getCurrentUserId,
} from "@/api/gathersSetters";

export default function History() {
  const theme = useColorScheme();
  const colors = COOLORS[theme ?? "dark"];
  const inset = useSafeAreaInsets();
  const { roomId } = useLocalSearchParams();
  
  const [payments, setPayments] = useState(() => getChashedTransactions(roomId));
  const [loading, setLoading] = useState(true);

  const ownerId = getCurrentUserId();

  const loadTransactions = useCallback(async () => {
    const roomId = getActiveRoom();

    if (!roomId) {
      router.replace("/(list)/RoomList");
      return;
    }

    setLoading(true);

    try {
       gatherTransactions(
        roomId,
        (cached) => {
          setPayments(cached || []);
          setLoading(false);
        },
        (fresh) => {
          setPayments(fresh || []);
          setLoading(false);
        }
      );
    } catch (err) {
      console.log("Błąd historii:", err.message);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
      const interval = setInterval(() => {
      gatherTransactions(
        undefined,
        null,
        (fresh) => {
          setPayments(fresh);
        }
      );
    }, 500);

    return () => clearInterval(interval);
    }, [loadTransactions])
  );

  return (
    <PaddedScreen backgroundColor={colors.surface}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: inset.bottom + 96,
          },
        ]}
      >
        <View
          style={[
            styles.titleBox,
            {
              backgroundColor: colors.primaryContainer,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.onPrimaryContainer,
              },
            ]}
          >
            Historia płatności
          </Text>
        </View>

        <View
          style={[
            styles.historyBox,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.outlineVariant,
            },
          ]}
        >
          {loading && payments.length === 0 ? (
            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              Ładowanie...
            </Text>
          ) : payments.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.onSurfaceVariant,
                },
              ]}
            >
              Brak historii płatności
            </Text>
          ) : (
            <HistoryList
              ownerId={ownerId}
              payments={payments}
            />
          )}
        </View>
      </ScrollView>
    </PaddedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },

  titleBox: {
    marginTop: 18,
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  historyBox: {
    borderRadius: 20,
    paddingHorizontal: 12,
    // paddingVertical: 8,
    // borderWidth: 1,
  },

  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },

  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },
});