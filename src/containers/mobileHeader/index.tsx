import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {
  handleSetting,
  handleSettingMode,
  handleSortDisplay,
  handleFetchViewMode,
  handleSelectBook,
  handleSearch,
  handleImportDialog,
  handleOPDSDialog,
  handleFetchUserInfo,
} from "../../store/actions";
import { stateType } from "../../store";
import MobileHeader from "./component";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,
    shelfTitle: state.sidebar.shelfTitle,
    viewMode: state.manager.viewMode,
    isSearch: state.manager.isSearch,
    isAuthed: state.manager.isAuthed,
    cloudSyncFunc: state.book.cloudSyncFunc,
  };
};
const actionCreator = {
  handleSetting,
  handleSettingMode,
  handleSortDisplay,
  handleFetchViewMode,
  handleSelectBook,
  handleSearch,
  handleImportDialog,
  handleOPDSDialog,
  handleFetchUserInfo,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(withRouter(MobileHeader as any) as any) as any);
