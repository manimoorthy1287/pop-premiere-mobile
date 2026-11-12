import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Category, fetchProducts, Product } from "@/lib/mobile-api";
import { theme } from "@/lib/theme";

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setBusy(true); setError("");
    try { const result = await fetchProducts(); setProducts(result.products); setCategories(result.categories); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load products."); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const categoryNames = new Set(categories.map((category) => category.name));
  return <View style={s.page}>
    <Text style={s.heading}>Products</Text>
    <Text style={s.sub}>{products.length} active items · {categoryNames.size} visible categories</Text>
    {error ? <Text style={s.error}>{error}</Text> : null}
    {busy ? <ActivityIndicator color={theme.colors.accent} /> : <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={busy} onRefresh={load} tintColor={theme.colors.accent} />}
      ListEmptyComponent={<Text style={s.empty}>No active products are available for this account.</Text>}
      renderItem={({ item }) => <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.sub}>{item.category ?? "Uncategorized"}{item.code ? ` · ${item.code}` : ""}</Text>
        </View>
        <Text style={s.price}>₹{Number(item.price).toFixed(2)}</Text>
      </View>}
    />}
  </View>;
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  heading: { fontFamily: theme.fonts.display, fontSize: 34, color: theme.colors.foreground, marginTop: 8 },
  sub: { fontFamily: theme.fonts.body, color: theme.colors.muted, marginTop: 5, marginBottom: 16 },
  row: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  name: { fontFamily: theme.fonts.semibold, fontSize: 16, color: theme.colors.foreground },
  price: { fontFamily: theme.fonts.bold, color: theme.colors.accent },
  empty: { fontFamily: theme.fonts.body, color: theme.colors.muted, padding: 18, backgroundColor: theme.colors.card, borderRadius: 12 },
  error: { fontFamily: theme.fonts.body, color: theme.colors.danger, padding: 12 },
});
