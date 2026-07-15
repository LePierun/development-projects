import ButtonThemed from "@/components/DataInput/Button";
import InputBar from "@/components/DataInput/InputBar";
import PaddedScreen from "@/components/Wraps/PaddedScreen";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { useNavigation, router } from "expo-router";
import { login } from "@/api/gathersSetters";
import { COOLORS } from "@/constants/theme";
import ErrorBox from "@/components/DataInput/ErrorBox";
import HandSvg from "@/components/HandSvg";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const theme = useColorScheme();
  const colors = COOLORS[theme ?? "dark"];

  const navi = useNavigation();

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateLoginForm() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Podaj email");
      return false;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Podaj poprawny adres email");
      return false;
    }

    if (!password.trim()) {
      setError("Podaj hasło");
      return false;
    }

    return true;
  }

  async function handleLogin() {
    if (!validateLoginForm()) return;

    try {
      setError("");

      const data = await login(email.trim(), password);

      if (data.success) {
        router.replace("/(list)/RoomList");
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Nie udało się zalogować");
    }
  }

  return (
    <PaddedScreen backgroundColor={colors.surface}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <HandSvg startRotating={false} />

              <Text
                style={[
                  styles.title,
                  {
                    color: colors.onSurface,
                  },
                ]}
              >
                Złotówa
              </Text>
            </View>

            <View style={styles.form}>
              <InputBar
                icon="mail-outline"
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setError("");
                  setEmail(text);
                }}
              />

              <InputBar
                icon="lock-closed-outline"
                placeholder="Hasło"
                value={password}
                secureTextEntry
                onChangeText={(text) => {
                  setError("");
                  setPassword(text);
                }}
              />

              <ErrorBox message={error} />

              <ButtonThemed
                title="Zaloguj się"
                onPress={handleLogin}
              />

              <ButtonThemed
                title="Zarejestruj się"
                variant="outlined"
                onPress={() => navi.navigate("Reg")}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaddedScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    fontSize: 32,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },

  form: {
    gap: 16,
  },
});