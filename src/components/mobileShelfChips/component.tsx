import React from "react";
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
  const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
  const sorted = ConfigService.getAllListConfig("sortedShelfList") || [];
  const titles = Array.from(new Set([...sorted, ...Object.keys(shelfList)]));

  const onSelect = (shelf: string) => {
    if (handleShelf) handleShelf(shelf);
    if (handleMode) handleMode("shelf");
    history?.push("/manager/shelf");
  };

  const onCreate = async () => {
    const res = await openCreateShelfDialog(t);
    if (res) {
      // refresh
      window.location.reload();
    }
  };

  const onManage = (e: React.MouseEvent, shelf: string) => {
    e.preventDefault();
    if (handleSortShelfDialog) handleSortShelfDialog(true);
  };

  return (
    <div className="mobile-shelf-chips">
      {titles.map((s) => (
        <button
          key={s}
          className="shelf-chip"
          onClick={() => onSelect(s)}
          onContextMenu={(e) => onManage(e, s)}
        >
          {t ? t(s) : s}
        </button>
      ))}
      <button className="shelf-chip add-chip" onClick={onCreate}>+
      </button>
    </div>
  );
};

export default MobileShelfChips;
