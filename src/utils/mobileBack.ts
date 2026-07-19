type MobileBackEntry = { key: string; onPop: () => void };

const stack: MobileBackEntry[] = [];

function onPopState(_e: PopStateEvent) {
  if (stack.length === 0) return;
  const top = stack.pop();
  try {
    top?.onPop();
  } catch (e) {
    console.error("mobileBack onPop error:", e);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", onPopState);

  // Capacitor physical back button (Android).
  // Lazily imported so the web bundle stays intact when the package is absent.
  const cap = (window as any).Capacitor;
  if (cap && cap.getPlatform() === "android") {
    import("@capacitor/app")
      .then(({ App }) => {
        App.addListener("backButton", ({ canGoBack }) => {
          if (stack.length > 0) {
            // Let our own stack handle the back action.
            const top = stack.pop();
            try {
              top?.onPop();
            } catch (e) {
              console.error("mobileBack Capacitor onPop error:", e);
            }
          } else if (canGoBack) {
            // Fall back to normal browser history navigation.
            window.history.back();
          } else {
            // No history left — minimize the app instead of killing it.
            import("@capacitor/app").then(({ App: A }) => A.minimizeApp());
          }
        });
      })
      .catch((err) => {
        console.warn("mobileBack: @capacitor/app not available:", err);
      });
  }
}

export function push(key: string, onPop: () => void) {
  try {
    window.history.pushState({ mobile_back_key: key }, "");
    stack.push({ key, onPop });
  } catch (e) {
    console.error("mobileBack push error:", e);
  }
}

export function pop() {
  if (stack.length === 0) return;
  // remove top without calling onPop
  stack.pop();
}

export function clear() {
  stack.length = 0;
}
