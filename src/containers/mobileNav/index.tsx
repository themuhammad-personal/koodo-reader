import { connect } from "react-redux";
import { handleSetting } from "../../store/actions";
import { handleMode } from "../../store/actions";
import { stateType } from "../../store";
import MobileNav from "./component";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,
  };
};

const mapDispatchToProps = {
  handleSetting,
  handleMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileNav);
