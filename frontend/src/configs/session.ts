export type Session =
  | { role: "customer"; id: string; name: string }
  | { role: "vendor"; id: string; name: string };

const KEY = "session";

export const saveSession = (s: Session) =>
  localStorage.setItem(KEY, JSON.stringify(s));

export const getSession = (): Session | null => {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
};

export const clearSession = () => localStorage.removeItem(KEY);