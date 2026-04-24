import { Outlet } from "react-router-dom";

import { guardConfigurations } from "@/app/layouts/guards/consts";
import { Guard } from "@/app/layouts/guards/guard";
import { AppNavigation } from "@/app/navigation/app-navigation/app-navigation";
import { SettingsNavigation } from "@/app/navigation/settings-navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar";
import { DATA_TEST_IDS } from "@/e2e/consts";

enum NavigationType {
  None = "none",
  App = "app",
  Settings = "settings",
}

interface NavigationConfig {
  type: NavigationType;
  showCreateWorkspace?: boolean;
  tabsDisabled?: boolean;
  openByDefault?: boolean;
}

interface InsetConfig {
  enabled: boolean;
  showTrigger: boolean;
}

interface RootLayoutProps {
  navigationConfig: NavigationConfig;
  insetConfig: InsetConfig;
}

const NavigationOutlet = ({
  type,
  tabsDisabled = false,
}: NavigationConfig) => {
  switch (type) {
    case NavigationType.App: {
      return (
        <AppNavigation
          tabsDisabled={tabsDisabled}
        />
      );
    }
    case NavigationType.Settings: {
      return <SettingsNavigation />;
    }
    default: {
      return null;
    }
  }
};

const InsetOutlet = ({ enabled, showTrigger }: InsetConfig) => {
  if (!enabled) {
    return (
      <div className="flex h-screen w-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarInset>
      {showTrigger && (
        <div className="p-4">
          <SidebarTrigger
            data-testid={DATA_TEST_IDS.NAVIGATION.TOGGLE_BUTTON}
          />
        </div>
      )}
      <Outlet />
    </SidebarInset>
  );
};

export const RootLayout = ({
  navigationConfig,
  insetConfig,
}: RootLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={navigationConfig.openByDefault}>
      <NavigationOutlet {...navigationConfig} />
      <InsetOutlet {...insetConfig} />
    </SidebarProvider>
  );
};

export const AppLayout = () => {
  return (
    <Guard guards={guardConfigurations.authenticatedApp()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.App,
          tabsDisabled: false,
          openByDefault: true,
        }}
        insetConfig={{
          enabled: true,
          showTrigger: false,
        }}
      />
    </Guard>
  );
};

export const InviteLayout = () => {
  return (
    <Guard guards={guardConfigurations.acceptInviteFlow()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.App,
          showCreateWorkspace: false,
          tabsDisabled: true,
          openByDefault: false,
        }}
        insetConfig={{
          enabled: true,
          showTrigger: true,
        }}
      />
    </Guard>
  );
};

export const InactiveLayout = () => {
  return (
    <Guard guards={guardConfigurations.inactiveAccountFlow()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.App,
          tabsDisabled: true,
          openByDefault: false,
        }}
        insetConfig={{
          enabled: true,
          showTrigger: true,
        }}
      />
    </Guard>
  );
};

export const RegistrationLayout = () => {
  return (
    <Guard guards={guardConfigurations.registrationFlow()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.App,
          tabsDisabled: true,
          openByDefault: false,
        }}
        insetConfig={{
          enabled: true,
          showTrigger: true,
        }}
      />
    </Guard>
  );
};

export const AuthLayout = () => {
  return (
    <Guard guards={guardConfigurations.unauthenticatedApp()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.None,
          tabsDisabled: false,
          openByDefault: false,
        }}
        insetConfig={{
          enabled: false,
          showTrigger: false,
        }}
      />
    </Guard>
  );
};

export const SettingsLayout = () => {
  return (
    <Guard guards={guardConfigurations.authenticatedApp()}>
      <RootLayout
        navigationConfig={{
          type: NavigationType.Settings,
          showCreateWorkspace: false,
          tabsDisabled: false,
          openByDefault: true,
        }}
        insetConfig={{
          enabled: true,
          showTrigger: false,
        }}
      />
    </Guard>
  );
};
