import { Tabs, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MobileSession, readSession } from "@/lib/mobile-api";
import { theme } from "@/lib/theme";

export default function TabLayout() {
 const [session,setSession]=useState<MobileSession|null>(null); const [ready,setReady]=useState(false);
 useEffect(()=>{readSession().then((s)=>{setSession(s);setReady(true)}).catch(()=>setReady(true));},[]);
 if(!ready)return <View style={[styles.center,{backgroundColor:theme.colors.background}]}><ActivityIndicator color={theme.colors.accent}/></View>;
 if(!session)return <Redirect href="/"/>;
 return <Tabs screenOptions={{
  headerStyle:{backgroundColor:theme.colors.background},
  headerTintColor:theme.colors.foreground,
  headerTitleStyle:{fontFamily:theme.fonts.bold,color:theme.colors.foreground},
  tabBarActiveTintColor:theme.colors.accent,
  tabBarInactiveTintColor:theme.colors.muted,
  tabBarStyle:{backgroundColor:theme.colors.card,borderTopColor:theme.colors.border},
  tabBarLabelStyle:{fontFamily:theme.fonts.medium},
 }}>
  <Tabs.Screen name="index" options={{title:"Home",headerTitle:"Pop Premiere"}}/>
  <Tabs.Screen name="products" options={{title:"Products",headerTitle:"Products"}}/>
  <Tabs.Screen name="account" options={{title:"Account",headerTitle:"Your account"}}/>
 </Tabs>;
}
const styles=StyleSheet.create({center:{flex:1,justifyContent:"center",alignItems:"center"}});
