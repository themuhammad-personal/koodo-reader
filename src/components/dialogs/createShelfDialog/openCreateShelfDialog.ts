import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import toast from "react-hot-toast";

declare var window: any;

export async function openCreateShelfDialog(t?: any) {
  return new Promise<boolean>((resolve) => {
    try {
      window.vex.dialog.buttons.YES.text = t ? t("Confirm") : "Confirm";
      window.vex.dialog.buttons.NO.text = t ? t("Cancel") : "Cancel";
      window.vex.dialog.prompt({
        message: t ? t("New shelf") : "New shelf",
        placeholder: t ? t("Enter shelf name") : "Enter shelf name",
        callback: function (input: any) {
          if (!input) {
            resolve(false);
            return;
          }
          const sanitized = String(input).replace(/[\[\]\"\{\},:\/\\|<>*?]/g, "");
          const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
          if (shelfList.hasOwnProperty(sanitized)) {
            toast.error(t ? t("Duplicate shelf") : "Duplicate shelf");
            resolve(false);
            return;
          }
          ConfigService.setListConfig(sanitized, "sortedShelfList");
          ConfigService.setOneMapConfig(sanitized, [], "shelfList");
          toast.success(t ? t("Created successfully") : "Created successfully");
          resolve(true);
        },
      });
    } catch (e) {
      console.error("openCreateShelfDialog error:", e);
      resolve(false);
    }
  });
}
