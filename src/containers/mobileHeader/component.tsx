import React from "react";
import "./mobileHeader.css";
import { Trans } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import toast from "react-hot-toast";
import SearchBox from "../../components/searchBox";
import { viewMode as viewModeList } from "../../constants/viewMode";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { pushMobileBack, popMobileBack } from "../../utils/mobileBack";

export interface MobileHeaderProps extends RouteComponentProps {
  mode: string;
  shelfTitle: string;
  viewMode: string;
  isSearch: boolean;
  isAuthed: boolean;
  cloudSyncFunc: (userInfo?: any) => Promise<any>;
  handleSetting: (isOpen: boolean) => void;
  handleSettingMode: (mode: string) => void;
  handleSortDisplay: (isOpen: boolean) => void;
  handleFetchViewMode: () => void;
  handleSelectBook: (isSelect: boolean) => void;
  handleSearch: (isSearch: boolean) => void;
  handleImportDialog: (isOpen: boolean) => void;
  handleOPDSDialog: (isOpen: boolean) => void;
  handleFetchUserInfo: () => Promise<any>;
  t: (key: string) => string;
}

interface MobileHeaderState {
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  isImportOpen: boolean;
  isSyncing: boolean;
}

const BACK_MENU = "mobile-header-menu";
const BACK_IMPORT = "mobile-header-import";
const BACK_SEARCH = "mobile-header-search";

class MobileHeader extends React.Component<
  MobileHeaderProps,
  MobileHeaderState
> {
  constructor(props: MobileHeaderProps) {
    super(props);
    this.state = {
      isSearchOpen: false,
      isMenuOpen: false,
      isImportOpen: false,
      isSyncing: false,
    };
  }

  getPageInfo = () => {
    const path = this.props.location.pathname;
    if (path.indexOf("/manager/home") > -1)
      return { title: "Books", isHome: true };
    if (path.indexOf("/manager/shelf") > -1)
      return { title: this.props.shelfTitle || "Shelf", isHome: false };
    if (path.indexOf("/manager/favorite") > -1)
      return { title: "Favorites", isHome: false };
    if (path.indexOf("/manager/trash") > -1)
      return { title: "Deleted Books", isHome: false };
    if (path.indexOf("/manager/highlight") > -1)
      return { title: "Highlights", isHome: false };
    if (path.indexOf("/manager/note") > -1)
      return { title: "Notes", isHome: false };
    return { title: "Books", isHome: true };
  };

  closeAllMenus = () => {
    if (this.state.isMenuOpen) popMobileBack(BACK_MENU);
    if (this.state.isImportOpen) popMobileBack(BACK_IMPORT);
    this.setState({ isMenuOpen: false, isImportOpen: false });
  };

  handleOpenMenu = () => {
    this.setState({ isMenuOpen: true, isImportOpen: false });
    pushMobileBack(BACK_MENU, () => this.setState({ isMenuOpen: false }));
  };

  handleOpenImport = () => {
    this.setState({ isImportOpen: true, isMenuOpen: false });
    pushMobileBack(BACK_IMPORT, () => this.setState({ isImportOpen: false }));
  };

  handleOpenSearch = () => {
    this.setState({ isSearchOpen: true });
    pushMobileBack(BACK_SEARCH, () => {
      this.props.handleSearch(false);
      this.setState({ isSearchOpen: false });
    });
  };

  handleCloseSearch = () => {
    this.props.handleSearch(false);
    const box = document.querySelector(
      ".header-search-box"
    ) as HTMLInputElement | null;
    if (box) box.value = "";
    popMobileBack(BACK_SEARCH);
    this.setState({ isSearchOpen: false });
  };

  handleImportLocal = () => {
    this.closeAllMenus();
    const input = document.getElementById(
      "import-book-box"
    ) as HTMLInputElement | null;
    if (input) {
      input.click();
    } else {
      toast.error(this.props.t("Import failed"));
    }
  };

  handleImportCloud = () => {
    this.closeAllMenus();
    this.props.handleImportDialog(true);
  };

  handleImportOPDS = () => {
    this.closeAllMenus();
    this.props.handleOPDSDialog(true);
  };

  handleChangeViewMode = (mode: string) => {
    ConfigService.setReaderConfig("viewMode", mode);
    this.props.handleFetchViewMode();
  };

  handleSort = () => {
    this.closeAllMenus();
    this.props.handleSortDisplay(true);
  };

  handleSelect = () => {
    this.closeAllMenus();
    this.props.handleSelectBook(true);
  };

  handleSync = async () => {
    if (this.state.isSyncing) return;
    if (!this.props.isAuthed) {
      toast(this.props.t("Please upgrade to Pro to use this feature"));
      this.props.handleSetting(true);
      this.props.handleSettingMode("account");
      return;
    }
    if (!ConfigService.getItem("defaultSyncOption")) {
      toast(
        this.props.t(
          "Please add data source in the setting-Sync and backup first"
        )
      );
      this.props.handleSetting(true);
      this.props.handleSettingMode("sync");
      return;
    }
    if (!this.props.cloudSyncFunc) return;
    this.setState({ isSyncing: true });
    try {
      const userInfo = await this.props.handleFetchUserInfo();
      await this.props.cloudSyncFunc(userInfo);
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isSyncing: false });
    }
  };

  renderIconButton = (
    iconClass: string,
    label: string,
    onClick: () => void,
    extraClass = ""
  ) => (
    <button
      type="button"
      className={"mobile-header-icon-btn " + extraClass}
      onClick={onClick}
      aria-label={this.props.t(label)}
    >
      <span className={iconClass}></span>
    </button>
  );

  render() {
    const { title, isHome } = this.getPageInfo();
    const isBookPage =
      this.props.location.pathname.indexOf("/manager/note") === -1 &&
      this.props.location.pathname.indexOf("/manager/highlight") === -1;

    return (
      <div className="mobile-header">
        <div className="mobile-header-bar">
          <h1 className="mobile-header-title">
            <Trans>{title}</Trans>
          </h1>
          <div className="mobile-header-actions">
            {isHome &&
              this.renderIconButton(
                "icon-add",
                "Import",
                this.handleOpenImport,
                "mobile-header-add-btn"
              )}
            {this.renderIconButton(
              "icon-search",
              "Search",
              this.handleOpenSearch
            )}
            {this.renderIconButton(
              this.state.isSyncing ? "icon-sync icon-rotate" : "icon-sync",
              "Sync",
              this.handleSync
            )}
            {isBookPage &&
              this.renderIconButton("icon-more", "More", this.handleOpenMenu)}
          </div>
        </div>

        {this.state.isSearchOpen && (
          <div className="mobile-search-overlay">
            <button
              type="button"
              className="mobile-search-back"
              onClick={this.handleCloseSearch}
              aria-label={this.props.t("Back")}
            >
              <span className="icon-return"></span>
            </button>
            <div className="mobile-search-field">
              <SearchBox />
            </div>
          </div>
        )}

        {(this.state.isMenuOpen || this.state.isImportOpen) && (
          <div className="mobile-sheet-scrim" onClick={this.closeAllMenus}>
            <div
              className="mobile-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-sheet-handle"></div>
              {this.state.isImportOpen ? (
                <>
                  <div className="mobile-sheet-title">
                    <Trans>Import</Trans>
                  </div>
                  <button
                    type="button"
                    className="mobile-sheet-item"
                    onClick={this.handleImportLocal}
                  >
                    <span className="icon-folder mobile-sheet-item-icon"></span>
                    <Trans>Import local books</Trans>
                  </button>
                  <button
                    type="button"
                    className="mobile-sheet-item"
                    onClick={this.handleImportCloud}
                  >
                    <span className="icon-cloud mobile-sheet-item-icon"></span>
                    <Trans>From cloud storage</Trans>
                  </button>
                  <button
                    type="button"
                    className="mobile-sheet-item"
                    onClick={this.handleImportOPDS}
                  >
                    <span className="icon-internet mobile-sheet-item-icon"></span>
                    <Trans>From OPDS</Trans>
                  </button>
                </>
              ) : (
                <>
                  <div className="mobile-sheet-title">
                    <Trans>View mode</Trans>
                  </div>
                  <div className="mobile-view-mode-row">
                    {viewModeList.map((item) => (
                      <button
                        type="button"
                        key={item.mode}
                        className={
                          "mobile-view-mode-item" +
                          (this.props.viewMode === item.mode
                            ? " active"
                            : "")
                        }
                        onClick={() => this.handleChangeViewMode(item.mode)}
                      >
                        <span className={"icon-" + item.icon}></span>
                        <span className="mobile-view-mode-label">
                          <Trans>{item.name}</Trans>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mobile-sheet-item"
                    onClick={this.handleSort}
                  >
                    <span className="icon-sort-desc mobile-sheet-item-icon"></span>
                    <Trans>Sort by</Trans>
                  </button>
                  <button
                    type="button"
                    className="mobile-sheet-item"
                    onClick={this.handleSelect}
                  >
                    <span className="icon-check mobile-sheet-item-icon"></span>
                    <Trans>Select</Trans>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MobileHeader;
