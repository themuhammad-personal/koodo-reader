import React from "react";
import "./mobileNav.css";
import { Trans } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface MobileNavProps extends RouteComponentProps {
  mode: string;
  handleMode: (mode: string) => void;
  handleSetting: (isOpen: boolean) => void;
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

  render() {
    const items = [
      { mode: "home", icon: "icon-home", label: "Home" },
      { mode: "shelf", icon: "icon-shelf", label: "Shelf" },
      { mode: "note", icon: "icon-note", label: "Note" },
      { mode: "settings", icon: "icon-setting", label: "Settings" },
    ];
    return (
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
    );
  }
}

export default withRouter(MobileNav);
