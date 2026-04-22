export enum ThemeOptions {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export const STORAGE_KEY = "abai-ui-theme";

export type ThemeProviderState = {
  theme: ThemeOptions;
  isDarkMode: boolean;
  isLightMode: boolean;
  setTheme: (theme: ThemeOptions) => void;
};

export const initialState: ThemeProviderState = {
  theme: ThemeOptions.System,
  isDarkMode: false,
  isLightMode: false,
  setTheme: () => null,
};
