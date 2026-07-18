export const isMobileScreen = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    if (window.matchMedia) {
      return window.matchMedia("(max-width: 700px)").matches;
    }
    return false;
  } catch (e) {
    console.error("isMobileScreen check failed:", e);
    return false;
  }
};
