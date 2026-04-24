import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import { AppLoader, PageLoader } from "@/components/loader";

// Layouts
const AppLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.AppLayout,
  })),
);
const AuthLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.AuthLayout,
  })),
);
const SettingsLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.SettingsLayout,
  })),
);
const InviteLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.InviteLayout,
  })),
);
const InactiveLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.InactiveLayout,
  })),
);
const RegistrationLayout = lazy(() =>
  import("@/app/layouts/app-layouts").then((module) => ({
    default: module.RegistrationLayout,
  })),
);
const RootLayout = lazy(() =>
  import("@/app/layouts/root-layout").then((module) => ({
    default: module.RootLayout,
  })),
);
const NotFoundLayout = lazy(() =>
  import("@/app/layouts/page-layouts/not-found").then((module) => ({
    default: module.NotFoundLayout,
  })),
);

// Pages
const Home = lazy(() =>
  import("@/pages/home/home-initializer").then((module) => ({
    default: module.HomeInitializer,
  })),
);
const Profile = lazy(() =>
  import("@/pages/settings/user/profile/profile-initializer").then(
    (module) => ({
      default: module.ProfileInitializer,
    }),
  ),
);

const Scans = lazy(() =>
  import("@/pages/scans/scans-page-initializer").then((module) => ({
    default: module.ScansPageInitializer,
  })),
);
const Billing = lazy(() =>
  import(
    "@/pages/settings/workspace/billing/billing-page/billing-initializer"
  ).then((module) => ({
    default: module.BillingInitializer,
  })),
);
const Invoices = lazy(() =>
  import(
    "@/pages/settings/workspace/billing/invoices-page/invoices-page-initializer"
  ).then((module) => ({
    default: module.InvoicesPageInitializer,
  })),
);
const Login = lazy(() =>
  import("@/pages/auth/login/login-initializer").then((module) => ({
    default: module.LoginInitializer,
  })),
);
const SignUp = lazy(() =>
  import("@/pages/auth/sign-up/sign-up-initializer").then((module) => ({
    default: module.SignUpInitializer,
  })),
);
const VerifyCode = lazy(() =>
  import("@/pages/auth/verify-code/verify-code-initializer").then((module) => ({
    default: module.VerifyCodeInitializer,
  })),
);
const Registration = lazy(() =>
  import("@/pages/account/registration/registration-initializer").then(
    (module) => ({
      default: module.RegistrationInitializer,
    }),
  ),
);
const Inactive = lazy(() =>
  import("@/pages/account/inactive/inactive-initializer").then((module) => ({
    default: module.InactiveInitializer,
  })),
);
const Preferences = lazy(() =>
  import("@/pages/settings/user/preferences/preferences-initializer").then(
    (module) => ({
      default: module.PreferencesInitializer,
    }),
  ),
);
const Details = lazy(() =>
  import("@/pages/settings/workspace/details/details-initializer").then(
    (module) => ({
      default: module.DetailsInitializer,
    }),
  ),
);
const AcceptInvie = lazy(() =>
  import("@/pages/account/accept-invite/accept-invite-initializer").then(
    (module) => ({
      default: module.AcceptInviteInitializer,
    }),
  ),
);
const NotFoundPage = lazy(() =>
  import("@/app/layouts/page-layouts/not-found").then((module) => ({
    default: module.NotFoundPage,
  })),
);


// Suspenses
const fullPageSuspense = (Component: React.JSX.Element) => (
  <Suspense fallback={<AppLoader />}>{Component}</Suspense>
);

const pageSuspense = (Component: React.JSX.Element) => (
  <Suspense fallback={<PageLoader />}>{Component}</Suspense>
);

// Router
export const router = createBrowserRouter([
  {
    path: Routes.Home,
    element: fullPageSuspense(<RootLayout />),
    errorElement: fullPageSuspense(<NotFoundLayout />),
    children: [
      {
        path: Routes.Home,
        element: fullPageSuspense(<AppLayout />),
        children: [
          {
            path: Routes.Home,
            element: pageSuspense(<Home />),
          },
          {
            path: Routes.Scans,
            element: pageSuspense(<Scans />),
          },

          {
            path: `${Routes.Home}/*`,
            element: pageSuspense(<NotFoundPage />),
          },
        ],
      },
      {
        path: Routes.Settings,
        element: fullPageSuspense(<SettingsLayout />),
        children: [
          {
            path: Routes.UserProfile,
            element: pageSuspense(<Profile />),
          },
          {
            path: Routes.UserPreferences,
            element: pageSuspense(<Preferences />),
          },

          {
            path: Routes.WorkspaceBilling,
            element: pageSuspense(<Billing />),
          },
          {
            path: Routes.WorkspaceInvoices,
            element: pageSuspense(<Invoices />),
          },
          {
            path: Routes.WorkspaceDetails,
            element: pageSuspense(<Details />),
          },
          {
            path: `${Routes.Settings}/*`,
            element: pageSuspense(<NotFoundPage />),
          },
        ],
      },
      {
        path: Routes.Auth,
        element: fullPageSuspense(<AuthLayout />),
        children: [
          {
            path: Routes.AuthLogin,
            element: pageSuspense(<Login />),
          },
          {
            path: Routes.AuthSignup,
            element: pageSuspense(<SignUp />),
          },
          {
            path: Routes.AuthVerifyCode,
            element: pageSuspense(<VerifyCode />),
          },
          {
            path: `${Routes.Auth}/*`,
            element: pageSuspense(<NotFoundLayout />),
          },
        ],
      },
      {
        path: Routes.Account,
        element: fullPageSuspense(<RegistrationLayout />),
        children: [
          {
            path: Routes.AccountRegistration,
            element: pageSuspense(<Registration />),
          },
          {
            path: `${Routes.Account}/*`,
            element: pageSuspense(<NotFoundPage />),
          },
        ],
      },
      {
        path: Routes.Account,
        element: fullPageSuspense(<InactiveLayout />),
        children: [
          {
            path: Routes.AccountInactive,
            element: pageSuspense(<Inactive />),
          },
          {
            path: `${Routes.Account}/*`,
            element: pageSuspense(<NotFoundPage />),
          },
        ],
      },
      {
        path: Routes.Account,
        element: fullPageSuspense(<InviteLayout />),
        children: [
          {
            path: Routes.AccountAcceptInvite,
            element: pageSuspense(<AcceptInvie />),
          },
          {
            path: `${Routes.Account}/*`,
            element: pageSuspense(<NotFoundPage />),
          },
        ],
      },
    ],
  },
]);
