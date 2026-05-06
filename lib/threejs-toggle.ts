export const THREEJS_TOGGLE_STORAGE_KEY = "aviora_threejs_enabled";

export function readThreeJsEnabledFromStorage(
  fallback: boolean = true,
): boolean {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(THREEJS_TOGGLE_STORAGE_KEY);
  if (raw == null) return fallback;
  return raw === "1";
}

export function writeThreeJsEnabledToStorage(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THREEJS_TOGGLE_STORAGE_KEY, value ? "1" : "0");
  window.dispatchEvent(
    new CustomEvent("aviora:threejs", { detail: { enabled: value } }),
  );
}

