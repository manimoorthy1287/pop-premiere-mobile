import * as SecureStore from "expo-secure-store";

const API = "https://shop-snapshot-sales-story.lovable.app/api/public/mobile";
const SESSION_KEY = "pop-premiere-mobile-session";

export type MobileUser = { id: string; email: string; name: string | null; role: "owner" | "employee" };
export type MobileSession = { access_token: string; refresh_token: string; expires_at: number; user: MobileUser };
export type Product = { id: string; code: string | null; name: string; price: number; category_id: string | null; category: string | null };
export type Category = { id: string; name: string; sort: number };

async function saveSession(session: MobileSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function readSession(): Promise<MobileSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as MobileSession; }
  catch { await SecureStore.deleteItemAsync(SESSION_KEY); return null; }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
  return body as T;
}

export async function signIn(email: string, password: string): Promise<MobileSession> {
  const response = await fetch(`${API}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "password", email: email.trim(), password }),
  });
  const session = await parseResponse<MobileSession>(response);
  await saveSession(session);
  return session;
}

export async function requestPasswordRecovery(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API}/password-recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  return parseResponse<{ message: string }>(response);
}

export async function signOut() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getValidAccessToken(): Promise<string> {
  const session = await readSession();
  if (!session) throw new Error("Please sign in again.");
  if (session.expires_at > Math.floor(Date.now() / 1000) + 60) return session.access_token;

  const response = await fetch(`${API}/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "refresh_token", refresh_token: session.refresh_token }),
  });
  if (response.status === 401 || response.status === 403) {
    await signOut();
  }
  const refreshed = await parseResponse<Omit<MobileSession, "user"> & { user?: MobileUser }>(response);
  const next = { ...session, ...refreshed, user: refreshed.user ?? session.user };
  await saveSession(next);
  return next.access_token;
}

export async function fetchProducts(): Promise<{ categories: Category[]; products: Product[] }> {
  const token = await getValidAccessToken();
  const response = await fetch(`${API}/products`, { headers: { Authorization: `Bearer ${token}` } });
  return parseResponse(response);
}
