import React from "react";
import ReactDOM from "react-dom";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";
import toast from "react-hot-toast";

interface Props {
  t?: any;
  onClose: (created: boolean) => void;
}

const MobileCreateShelf: React.FC<Props> = ({ t, onClose }) => {
  const [value, setValue] = React.useState("");

  const create = () => {
    const sanitized = String(value).replace(/[\[\]\"\{\},:\/\\|<>*?]/g, "");
    if (!sanitized) {
      toast.error(t ? t("Shelf Title is Empty") : "Shelf Title is Empty");
      return;
    }
    const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
    if (shelfList.hasOwnProperty(sanitized)) {
      toast.error(t ? t("Duplicate shelf") : "Duplicate shelf");
      return;
    }
    ConfigService.setListConfig(sanitized, "sortedShelfList");
    ConfigService.setOneMapConfig(sanitized, [], "shelfList");
    toast.success(t ? t("Created successfully") : "Created successfully");
    onClose(true);
  };

  const cancel = () => {
    onClose(false);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="mobile-create-shelf-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={cancel}
    >
      <div
        className="mobile-create-shelf-sheet"
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#1e1e1e",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 20,
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <button
            onClick={cancel}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 20,
              marginRight: 12,
            }}
            aria-label="back"
          >
            ←
          </button>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
            {t ? t("New shelf") : "New shelf"}
          </div>
        </div>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t ? t("Enter shelf name") : "Enter shelf name"}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#121212",
            color: "#fff",
            boxSizing: "border-box",
            marginBottom: 12,
            fontSize: 14,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={cancel}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#fff",
            }}
          >
            {t ? t("Cancel") : "Cancel"}
          </button>
          <button
            onClick={create}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 10,
              background: "#ff2d55",
              border: "none",
              color: "#fff",
            }}
          >
            {t ? t("Confirm") : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export function showMobileCreateShelf(t?: any): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onClose = (created: boolean) => {
      try {
        ReactDOM.unmountComponentAtNode(container);
      } catch (e) {
        console.error(e);
      }
      if (container.parentNode) container.parentNode.removeChild(container);
      resolve(created);
    };
    ReactDOM.render(<MobileCreateShelf t={t} onClose={onClose} />, container);
  });
}
