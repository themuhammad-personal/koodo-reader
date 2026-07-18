import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { openCreateShelfDialog } from "../dialogs/createShelfDialog/openCreateShelfDialog";

interface Props {
  history?: any;
  t?: any;
  handleShelf?: (shelf: string) => void;
  handleMode?: (mode: string) => void;
  handleSortShelfDialog?: (open: boolean) => void;
}

const MobileShelfChips: React.FC<Props> = ({
  history,
  t,
  handleShelf,
  handleMode,
  handleSortShelfDialog,
}) => {
  const [titles, setTitles] = useState<string[]>([]);
  const longPressTimer = useRef<number | null>(null);

  const loadShelves = () => {
    const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
    const sorted = ConfigService.getAllListConfig("sortedShelfList") || [];
    const merged = Array.from(new Set([...sorted, ...Object.keys(shelfList)]));
    setTitles(merged);
  };

  useEffect(() => {
    loadShelves();
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };
  }, []);

  const onSelect = (s: string) => {
    if (handleShelf) handleShelf(s);
    if (handleMode) handleMode("shelf");
    history?.push("/manager/shelf");
  };

  const onCreate = async () => {
    const res = await openCreateShelfDialog(t);
    if (res) {
      // refresh shelf list without full reload
      loadShelves();
    }
  };

  const onManage = (shelf: string) => {
    if (handleSortShelfDialog) handleSortShelfDialog(true);
  };

  const startLongPress = (shelf: string) => {
    longPressTimer.current = window.setTimeout(() => {
      onManage(shelf);
      longPressTimer.current = null;
    }, 600) as unknown as number;
  };
  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className="mobile-shelf-chips">
      {titles.map((s) => (
        <button
          key={s}
          className="shelf-chip"
          onClick={() => onSelect(s)}
          onContextMenu={(e) => {
            e.preventDefault();
            onManage(s);
          }}
          onTouchStart={() => startLongPress(s)}
          onTouchEnd={() => clearLongPress()}
          onTouchMove={() => clearLongPress()}
          onTouchCancel={() => clearLongPress()}
          aria-label={t ? t(s) : s}
        >
          {t ? t(s) : s}
        </button>
      ))}
      <button
        className="shelf-chip add-chip"
        onClick={onCreate}
        aria-label={t ? t("New shelf") : "New shelf"}
      >
        +
      </button>
    </div>
  );
};

export default MobileShelfChips;
