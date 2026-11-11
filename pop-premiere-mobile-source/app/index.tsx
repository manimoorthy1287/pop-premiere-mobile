import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Redirect } from "expo-router";
import { MobileSession, readSession, signIn } from "@/lib/mobile-api";

export default function SignInScreen() {
  const [session, setSession] = useState<MobileSession | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    readSession().then((value) => { setSession(value); setReady(true); }).catch(() => setReady(true));
  }, []);
  if (!ready) return <View style={styles.center}><ActivityIndicator color="#d7a900" /></View>;
  if (session) return <Redirect href="/(tabs)" />;
  const handleSignIn = async () => {
    setBusy(true);
    try { setSession(await signIn(email, password)); }
    catch (error) { Alert.alert("Could not sign in", error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  };
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
    <View style={styles.card}>
      <View style={styles.logo}><Text style={styles.logoText}>P</Text></View>
      <Text style={styles.title}>Pop Premiere</Text>
      <Text style={styles.sub}>Shop operations, in your pocket</Text>
      <>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" style={styles.input} />
        <Pressable onPress={handleSignIn} disabled={busy} style={styles.button}>{busy ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign in</Text>}</Pressable>
      </>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ page:{flex:1,backgroundColor:"#f6f5f1",justifyContent:"center",padding:24}, center:{flex:1,justifyContent:"center",alignItems:"center"}, card:{backgroundColor:"white",borderRadius:24,padding:26,gap:14,elevation:2}, logo:{width:62,height:62,borderRadius:20,backgroundColor:"#efbd00",justifyContent:"center",alignItems:"center"},logoText:{fontSize:29,fontWeight:"800",color:"white"},title:{fontSize:28,fontWeight:"800",color:"#20201e"},sub:{fontSize:15,color:"#6a6a65",marginBottom:8},input:{borderWidth:1,borderColor:"#e3e1da",borderRadius:12,padding:15,fontSize:16},button:{backgroundColor:"#252522",padding:16,borderRadius:12,alignItems:"center",marginTop:4},buttonText:{color:"white",fontWeight:"700",fontSize:16},info:{color:"#7a5f00",backgroundColor:"#fff6d3",padding:14,borderRadius:12,lineHeight:21}}
);
