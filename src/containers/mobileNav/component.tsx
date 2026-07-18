import React from "react";
import "./mobileNav.css";
import { Trans } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import toast from "react-hot-toast";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";

interface MobileNavProps extends RouteComponentProps {
  mode: string;
  handleMode: (mode: string) => void;
  handleSetting: (isOpen: boolean) => void;
  handleShelf: (shelfTitle: string) => void;
  handleFetchBooks: () => void;
  t: (key: string) => string;
}

class MobileNav extends React.Component<MobileNavProps> {
  handleNav = (mode: string) => {
    if (mode === "settings") {
      this.props.handleSetting(true);
      return;
    }
    this.props.handleMode(mode);
    this.props.history.push(`/manager/${mode}`);
  };

  isActive = (mode: string) => {
    const path = this.props.location.pathname;
    if (mode === "settings") return false;
    return path.indexOf(`/manager/${mode}`) > -1;
  };

  handleCreateShelf = () => {
    const name = window.prompt(this.props.t("Shelf Title"));
    if (!name) return;
    const shelfList = ConfigService.getAllMapConfig("shelfList");
    if (shelfList.hasOwnProperty(name)) {
      toast(this.props.t("Duplicate shelf"));
      return;
    }
    ConfigService.setListConfig(name, "sortedShelfList");
    ConfigService.setOneMapConfig(name, [], "shelfList");
    toast.success(this.props.t("Created successfully"));
    this.props.handleShelf(name);
    this.props.handleFetchBooks();
  };

  render() {
    const items = [
      { mode: "home", icon: "icon-home", label: "Home" },
      { mode: "shelf", icon: "icon-shelf", label: "Shelf" },
      { mode: "note", icon: "icon-note", label: "Note" },
      { mode: "settings", icon: "icon-setting", label: "Settings" },
    ];
    const isShelfPage =
      this.props.location.pathname.indexOf("/manager/shelf") > -1;
    return (
      <>
        {isShelfPage && (
          <div
            className="mobile-shelf-fab"
            onClick={this.handleCreateShelf}
          >
            <span className="icon-add"></span>
          </div>
        )}
        <div className="mobile-nav-container">
          {items.map((item) => (
            <div
              key={item.mode}
              className={
                "mobile-nav-item" +
                (this.isActive(item.mode) ? " mobile-nav-item-active" : "")
              }
              onClick={() => this.handleNav(item.mode)}
            >
              <span className={"mobile-nav-icon " + item.icon}></span>
              <span className="mobile-nav-label">
                <Trans>{item.label}</Trans>
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default withRouter(MobileNav);
