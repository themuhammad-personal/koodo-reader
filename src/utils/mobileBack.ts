import { isMobileScreen } from "./common";

/**
 * History-based back manager for mobile (Capacitor Android WebView).
 *
 * When a dialog / full-screen overlay opens on mobile we push a marker onto the
 * browser history. The Android hardware / gesture back button triggers a
 * `popstate`, which we intercept to close the topmost overlay instead of
 * navigating away or leaving the app. No native plugin required.
 *
 * Desktop is never affected: registration is a no-op when not on a mobile
 * screen.
 */

type BackHandler = () => void;

interface BackEntry {
  id: string;
  handler: BackHandler;
}

const stack: BackEntry[] = [];
let isListening = false;
// Set while we programmatically call history.back() so the resulting popstate
// does not re-trigger a handler.
let isProgrammaticPop = false;

const STATE_KEY = "koodoMobileBack";

const handlePopState = () => {
  if (isProgrammaticPop) {
    isProgrammaticPop = false;
    return;
  }
  const entry = stack.pop();
  if (entry) {
    try {
      entry.handler();
    } catch (error) {
      console.error(error);
    }
  }
};

const ensureListening = () => {
  if (isListening) return;
  window.addEventListener("popstate", handlePopState);
  isListening = true;
};

/**
 * Register a close handler for an overlay that just opened.
 * Pushes a history marker so the next back gesture closes this overlay.
 */
export const pushMobileBack = (id: string, handler: BackHandler): void => {
  if (!isMobileScreen()) return;
  // Avoid duplicate registration for the same overlay id.
  if (stack.some((entry) => entry.id === id)) return;
  ensureListening();
  stack.push({ id, handler });
  try {
    window.history.pushState({ [STATE_KEY]: id }, "");
  } catch (error) {
    console.error(error);
  }
};

/**
 * Remove a previously registered handler when the overlay is closed through
 * the UI (e.g. a back arrow or tapping the scrim). Consumes the matching
 * history marker so the history stack stays balanced.
 */
export const popMobileBack = (id: string): void => {
  const index = stack.findIndex((entry) => entry.id === id);
  if (index === -1) return;
  stack.splice(index, 1);
  // Consume the history marker we pushed on open.
  isProgrammaticPop = true;
  try {
    window.history.back();
  } catch (error) {
    isProgrammaticPop = false;
    console.error(error);
  }
};
