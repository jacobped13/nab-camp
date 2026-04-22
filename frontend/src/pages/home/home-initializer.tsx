import { Page } from "@/app/layouts/page-layouts/page";
import { HomePage } from "@/pages/home/home-page";

export const HomeInitializer = () => {
  return (
    <Page loading={false} title="Dashboard">
      <HomePage />
    </Page>
  );
};
