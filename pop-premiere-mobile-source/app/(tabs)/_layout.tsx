import { Tabs, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MobileSession, readSession } from "@/lib/mobile-api";

export default function TabLayout() {
 const [session,setSession]=useState<MobileSession|null>(null); const [ready,setReady]=useState(false);
 useEffect(()=>{readSession().then((s)=>{setSession(s);setReady(true)}).catch(()=>setReady(true));},[]);
 if(!ready)return <View style={styles.center}><ActivityIndicator color="#d7a900"/></View>;
 if(!session)return <Redirect href="/"/>;
 return <Tabs screenOptions={{headerStyle:{backgroundColor:"#faf9f6"},headerTitleStyle:{fontWeight:"700"},tabBarActiveTintColor:"#a78100",tabBarStyle:{backgroundColor:"#fff"}}}>
  <Tabs.Screen name="index" options={{title:"Home",headerTitle:"Pop Premiere"}}/>
  <Tabs.Screen name="products" options={{title:"Products",headerTitle:"Products"}}/>
  <Tabs.Screen name="account" options={{title:"Account",headerTitle:"Your account"}}/>
 </Tabs>;
}
const styles=StyleSheet.create({center:{flex:1,justifyContent:"center",alignItems:"center"}});
