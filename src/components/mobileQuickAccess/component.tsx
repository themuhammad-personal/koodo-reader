import React from "react";
import "./style.css";

interface QuickAccessProps {
  history?: any;
  t?: any;
}

const QuickAccess: React.FC<QuickAccessProps> = ({ history, t }) => {
  const items = [
    { key: "favorite", label: t ? t("Favorites") : "Favorites" },
    { key: "sort-by-added", label: t ? t("Recently added") : "Recently added" },
    { key: "sort-by-read", label: t ? t("Recently read") : "Recently read" },
    { key: "trash", label: t ? t("Trash") : "Trash" },
  ];

  const go = (key: string) => {
    if (key === "sort-by-added") {
      history?.push("/manager/home?sort=added");
    } else if (key === "sort-by-read") {
      history?.push("/manager/home?sort=read");
    } else if (key === "favorite") {
      history?.push("/manager/favorite");
    } else if (key === "trash") {
      history?.push("/manager/trash");
    }
  };

  return (
    <div className="mobile-quick-access">
      {items.map((it) => (
        <div key={it.key} className="qa-item" onClick={() => go(it.key)}>
          <div className="qa-icon" />
          <div className="qa-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickAccess;
