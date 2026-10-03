/** localStorage access that never throws (private mode, blocked storage, SSR). */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the app keeps working with in-memory state.
  }
}
