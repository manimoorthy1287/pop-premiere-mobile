import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { MobileSession, readSession, requestPasswordRecovery, signIn } from "@/lib/mobile-api";
import { theme } from "@/lib/theme";

const WEB_AUTH = "https://shop-snapshot-sales-story.lovable.app/auth";

export default function SignInScreen() {
  const [session, setSession] = useState<MobileSession | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signIn" | "recovery">("signIn");
  const [recoverySent, setRecoverySent] = useState(false);

  useEffect(() => {
    readSession().then((value) => { setSession(value); setReady(true); }).catch(() => setReady(true));
  }, []);

  if (!ready) return <View style={styles.loading}><ActivityIndicator color={theme.colors.accent} /></View>;
  if (session) return <Redirect href="/(tabs)" />;

  const handleSignIn = async () => {
    setBusy(true);
    try {
      setSession(await signIn(email, password));
    } catch (error) {
      Alert.alert("Could not sign in", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleRecovery = async () => {
    setBusy(true);
    try {
      await requestPasswordRecovery(email);
      setRecoverySent(true);
    } catch (error) {
      Alert.alert("Could not send reset link", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const openGoogleSignIn = async () => {
    try {
      await Linking.openURL(WEB_AUTH);
    } catch {
      Alert.alert("Could not open Pop Premiere", "Please open shop-snapshot-sales-story.lovable.app/auth in your browser.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Image source={require("../assets/pop-premiere-logo.webp")} style={styles.logo} resizeMode="contain" accessibilityLabel="Pop Premiere" />
          <Text style={styles.title}>{mode === "signIn" ? "Sign in" : "Reset password"}</Text>

          <View style={styles.card}>
            {mode === "recovery" ? (
              <>
                <Text style={styles.help}>Enter your account email and we’ll send a password reset link if it can receive one.</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.input}
                  editable={!busy && !recoverySent}
                />
                {recoverySent ? (
                  <Text accessibilityRole="text" style={styles.success}>If this email can receive a reset, a link is on its way. Check your inbox and spam folder.</Text>
                ) : (
                  <Pressable onPress={handleRecovery} disabled={busy || !email.trim()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, (busy || !email.trim()) && styles.disabled]}>
                    {busy ? <ActivityIndicator color={theme.colors.primaryForeground} /> : <Text style={styles.primaryButtonText}>Send reset link</Text>}
                  </Pressable>
                )}
                <Pressable onPress={() => { setMode("signIn"); setRecoverySent(false); }} style={styles.textButton}>
                  <Text style={styles.link}>Back to sign in</Text>
                </Pressable>
              </>
            ) : (
              <>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.input}
                  editable={!busy}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="current-password"
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.input}
                  editable={!busy}
                />
                <Pressable onPress={() => setMode("recovery")} style={styles.forgot}>
                  <Text style={styles.link}>Forgot password?</Text>
                </Pressable>
                <Pressable onPress={handleSignIn} disabled={busy || !email.trim() || !password} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, (busy || !email.trim() || !password) && styles.disabled]}>
                  {busy ? <ActivityIndicator color={theme.colors.primaryForeground} /> : <Text style={styles.primaryButtonText}>Sign in</Text>}
                </Pressable>
                <View style={styles.divider}><View style={styles.rule} /><Text style={styles.or}>or</Text><View style={styles.rule} /></View>
                <Pressable onPress={openGoogleSignIn} style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </Pressable>
              </>
            )}
          </View>

          <Text style={styles.footer}>
            {mode === "signIn"
              ? "Google sign-in opens the full Pop Premiere app in your browser. Native Google sign-in is not enabled yet."
              : "Use the link in your email to set a password, then return here to sign in."}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 30 },
  content: { width: "100%", maxWidth: 430, alignSelf: "center", gap: 18 },
  loading: { flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" },
  logo: { width: 190, height: 88, alignSelf: "center", marginBottom: 1 },
  title: { color: theme.colors.foreground, fontFamily: theme.fonts.display, fontSize: 42, letterSpacing: 1.2, textAlign: "center", marginBottom: 3 },
  card: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 16, padding: 18, gap: 12 },
  help: { color: theme.colors.muted, fontFamily: theme.fonts.body, fontSize: 15, lineHeight: 21, marginBottom: 2 },
  input: { minHeight: 52, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, backgroundColor: theme.colors.input, paddingHorizontal: 15, color: theme.colors.foreground, fontFamily: theme.fonts.body, fontSize: 16 },
  forgot: { alignSelf: "flex-end", paddingVertical: 4, paddingHorizontal: 2 },
  link: { color: theme.colors.accent, fontFamily: theme.fonts.semibold, fontSize: 14 },
  primaryButton: { minHeight: 52, borderRadius: 12, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 2 },
  primaryButtonText: { color: theme.colors.primaryForeground, fontFamily: theme.fonts.bold, fontSize: 17 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.78 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 1 },
  rule: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  or: { color: theme.colors.muted, fontFamily: theme.fonts.body, fontSize: 13 },
  googleButton: { minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.input, flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" },
  googleG: { color: theme.colors.foreground, fontFamily: theme.fonts.extrabold, fontSize: 18 },
  googleText: { color: theme.colors.foreground, fontFamily: theme.fonts.semibold, fontSize: 16 },
  success: { color: theme.colors.accent, backgroundColor: "#423a24", borderRadius: 10, padding: 12, fontFamily: theme.fonts.body, fontSize: 14, lineHeight: 20 },
  textButton: { alignItems: "center", paddingVertical: 7 },
  footer: { color: theme.colors.muted, fontFamily: theme.fonts.body, textAlign: "center", fontSize: 13, lineHeight: 19, paddingHorizontal: 10 },
});
