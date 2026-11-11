import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Category, fetchProducts, Product } from "@/lib/mobile-api";

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
    {busy ? <ActivityIndicator color="#a78100" /> : <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={busy} onRefresh={load} />}
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
  page: { flex: 1, backgroundColor: "#f6f5f1", padding: 20 },
  heading: { fontSize: 26, fontWeight: "800", color: "#222", marginTop: 8 },
  sub: { color: "#777", marginTop: 5, marginBottom: 16 },
  row: { backgroundColor: "white", borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  name: { fontWeight: "700", fontSize: 16, color: "#272723" },
  price: { fontWeight: "700", color: "#7e6500" },
  empty: { color: "#6f6d65", padding: 18, backgroundColor: "white", borderRadius: 12 },
  error: { color: "#a13327", padding: 12 },
});
