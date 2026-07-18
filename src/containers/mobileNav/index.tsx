import { connect } from "react-redux";
import { handleSetting, handleMode, handleShelf } from "../../store/actions";
import { handleFetchBooks } from "../../store/actions/manager";
import { stateType } from "../../store";
import { withTranslation } from "react-i18next";
import MobileNav from "./component";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,
  };
};

const mapDispatchToProps = {
  handleSetting,
  handleMode,
  handleShelf,
  handleFetchBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(MobileNav as any) as any);
