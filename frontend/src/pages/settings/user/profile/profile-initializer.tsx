import { Page } from "@/app/layouts/page-layouts/page";
import { ProfilePage } from "@/pages/settings/user/profile/profile-page";

export const ProfileInitializer = () => {
  return (
    <Page title="Profile" loading={false}>
      <ProfilePage />
    </Page>
  );
};
