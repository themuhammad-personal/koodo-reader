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
