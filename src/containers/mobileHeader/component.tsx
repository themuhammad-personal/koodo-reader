import React from "react";
import "./style.css";

class MobileHeader extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  handleAdd = () => {
    // open import dialog if handler provided
    if (this.props.handleImportDialog) {
      this.props.handleImportDialog(true);
    } else {
      // fallback: try to click hidden input
      const el = document.getElementById("import-book-box") as HTMLInputElement | null;
      if (el) el.click();
    }
  };

  handleSearchToggle = () => {
    if (this.props.handleToggleSearch) {
      this.props.handleToggleSearch();
    } else {
      // try open existing searchbox focus
      const input = document.querySelector(".search-box input") as HTMLInputElement | null;
      if (input) {
        input.focus();
      }
    }
  };

  handleMore = () => {
    if (this.props.handleOpenMenu) {
      this.props.handleOpenMenu();
    } else {
      // fallback: toggle sort display if available
      if (this.props.handleSortDisplay) {
        this.props.handleSortDisplay(!this.props.isSortDisplay);
      }
    }
  };

  render() {
    const title = (() => {
      const path = window.location.pathname || "";
      if (path.includes("/manager/shelf")) return this.props.t ? this.props.t("Shelf") : "Shelf";
      if (path.includes("/manager/note")) return this.props.t ? this.props.t("Note") : "Note";
      return this.props.t ? this.props.t("Home") : "Home";
    })();

    return (
      <div className="mobile-header">
        <div className="mobile-header-left">{title}</div>
        <div className="mobile-header-right">
          <button className="icon-btn" onClick={this.handleMore} aria-label="more">⋮</button>
          <button className="icon-btn" onClick={this.handleSearchToggle} aria-label="search">🔍</button>
          <button className="icon-btn" onClick={() => { if (this.props.handleCloudSyncFunc) this.props.handleCloudSyncFunc(); }} aria-label="sync">⟳</button>
          <button className="pill-add" onClick={this.handleAdd}>+ Add</button>
        </div>
      </div>
    );
  }
}

export default MobileHeader;
