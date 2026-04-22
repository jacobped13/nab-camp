import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
);

const sharedVariables = {
  fontFamily: '"Inter", system-ui, sans-serif',
  fontSmooth: "antialiased",

  fontSizeBase: "16px",
  fontSizeSm: "14px",
  fontSizeXs: "12px",
  fontSize2Xs: "10px",
  fontSize3Xs: "9px",
  fontSizeLg: "18px",
  fontSizeXl: "20px",

  fontWeightLight: "300",
  fontWeightNormal: "400",
  fontWeightMedium: "500",
  fontWeightBold: "700",

  spacingUnit: "4px",
  gridRowSpacing: "16px",
  gridColumnSpacing: "16px",
  tabSpacing: "10px",
  accordionItemSpacing: "12px",

  borderRadius: "8px",
  colorDanger: "#cb3a2d",
  colorWarning: "#ebc061",

  iconCardErrorColor: "#cb3a2d",
  iconCardCvcErrorColor: "#cb3a2d",
  iconPasscodeDeviceNotificationColor: "#ebc061",

  tabIconSelectedColor: "#6e47f5",
  tabIconMoreColor: "#6e6589",
  tabIconMoreHoverColor: "#352e4e",
};

export const stripeLightVariables = {
  ...sharedVariables,
  colorPrimary: "#6e47f5",
  colorBackground: "#ffffff",
  colorText: "#1e1b2e",
  colorSuccess: "#c08a20",
  colorTextSecondary: "#6e6589",
  colorTextPlaceholder: "#6e6589",

  accessibleColorOnColorPrimary: "#f7f3ff",
  accessibleColorOnColorBackground: "#1e1b2e",
  accessibleColorOnColorSuccess: "#000000",
  accessibleColorOnColorDanger: "#ffffff",
  accessibleColorOnColorWarning: "#000000",

  iconColor: "#6e6589",
  iconHoverColor: "#352e4e",
  iconCardCvcColor: "#352e4e",
  iconCheckmarkColor: "#6e47f5",
  iconChevronDownColor: "#6e6589",
  iconChevronDownHoverColor: "#352e4e",
  iconCloseColor: "#6e6589",
  iconCloseHoverColor: "#1e1b2e",
  iconLoadingIndicatorColor: "#6e47f5",
  iconMenuColor: "#6e6589",
  iconMenuHoverColor: "#352e4e",
  iconPasscodeDeviceColor: "#6e47f5",
  iconPasscodeDeviceHoverColor: "#693ff9",
  iconRedirectColor: "#6e47f5",

  tabIconColor: "#6e6589",
  tabIconHoverColor: "#352e4e",

  logoColor: "light",
  focusBoxShadow: "0 0 0 2px #6e47f5",
  focusOutline: "2px solid #6e47f5",
};

export const stripeDarkVariables = {
  ...sharedVariables,
  colorPrimary: "#693ff9",
  colorBackground: "#09090b",
  colorText: "#fcfcfc",
  colorSuccess: "#6fc7a3",
  colorTextSecondary: "#f4f4f5",
  colorTextPlaceholder: "#f4f4f5",

  accessibleColorOnColorPrimary: "#1e1b2e",
  accessibleColorOnColorBackground: "#1e1b2e",
  accessibleColorOnColorSuccess: "#1e1b2e",
  accessibleColorOnColorDanger: "#1e1b2e",
  accessibleColorOnColorWarning: "#1e1b2e",

  iconColor: "#b5a8d9",
  iconHoverColor: "#f4f4f4",
  iconCardCvcColor: "#b5a8d9",
  iconCheckmarkColor: "#693ff9",
  iconChevronDownColor: "#b5a8d9",
  iconChevronDownHoverColor: "#f4f4f4",
  iconCloseColor: "#b5a8d9",
  iconCloseHoverColor: "#fcfcfc",
  iconLoadingIndicatorColor: "#693ff9",
  iconMenuColor: "#b5a8d9",
  iconMenuHoverColor: "#fcfcfc",
  iconPasscodeDeviceColor: "#693ff9",
  iconPasscodeDeviceHoverColor: "#6e47f5",
  iconRedirectColor: "#693ff9",

  tabIconColor: "#fcfcfc",
  tabIconHoverColor: "#fcfcfc",
  tabIconSelectedColor: "#fcfcfc",
  tabIconMoreColor: "#fcfcfc",
  tabIconMoreHoverColor: "#fcfcfc",

  logoColor: "dark",
  focusBoxShadow: "0 0 0 2px #693ff9",
  focusOutline: "2px solid #693ff9",
};
