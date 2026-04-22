import { Page } from "@/app/layouts/page-layouts/page";

export const NotFoundPage = () => {
  return (
    <Page title="Not Found" loading={false}>
      <div className="flex items-center gap-2 justify-center h-full">
        <span className="font-extrabold text-sm">404</span>
        <span>|</span>
        <span className="text-sm">Page not found</span>
      </div>
    </Page>
  );
};

export const NotFoundLayout = () => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="font-extrabold text-sm">404</span>
      <span>|</span>
      <span className="text-sm">Page not found</span>
    </div>
  );
};
