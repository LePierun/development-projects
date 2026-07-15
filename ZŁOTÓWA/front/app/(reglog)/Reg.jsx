import ButtonThemed from "@/components/DataInput/Button";
import InputBar from "@/components/DataInput/InputBar";
import PaddedScreen from "@/components/Wraps/PaddedScreen";
import { COOLORS } from "@/constants/theme";
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
import { register } from "@/api/gathersSetters";
import { useNavigation } from "expo-router";
import ErrorBox from "@/components/DataInput/ErrorBox";
import HandSvg from "@/components/HandSvg";

export default function RegScreen() {
  const scheme = useColorScheme();
  const colors = COOLORS[scheme ?? "dark"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navi = useNavigation();

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateRegisterForm() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Podaj imię");
      return false;
    }

    if (trimmedName.length < 2) {
      setError("Imię musi mieć minimum 2 znaki");
      return false;
    }

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

    if (password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków");
      return false;
    }

    return true;
  }

  async function handleRegister() {
    if (!validateRegisterForm()) return;

    try {
      setError("");

      await register(name.trim(), email.trim(), password);

      navi.navigate("Login");
    } catch (err) {
      setError(err.message || "Nie udało się zarejestrować");
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

              <Text style={[styles.title, { color: colors.onSurface }]}>
                Utwórz konto
              </Text>
            </View>

            <View style={styles.form}>
              <InputBar
                icon="person-outline"
                placeholder="Imię"
                value={name}
                onChangeText={(text) => {
                  setError("");
                  setName(text);
                }}
              />

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

              <View style={styles.buttons}>
                <ButtonThemed
                  title="Zarejestruj się"
                  onPress={handleRegister}
                />

                <ButtonThemed
                  title="Zaloguj się"
                  variant="outlined"
                  onPress={() => navi.navigate("Login")}
                />
              </View>
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
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  error: {
    fontSize: 14,
    textAlign: "center",
  },

  buttons: {
    marginTop: 8,
    gap: 12,
  },
});