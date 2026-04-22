import { Page } from "@/app/layouts/page-layouts/page";
import { PreferencesPage } from "@/pages/settings/user/preferences/preferences-page";

export const PreferencesInitializer = () => {
  return (
    <Page title="Preferences" loading={false}>
      <PreferencesPage />
    </Page>
  );
};
