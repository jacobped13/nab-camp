/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FIREBASE_AUTH_EMULATOR_HOST: string;
  readonly VITE_FIREBASE_CONFIG: string;
  readonly VITE_LAUNCHDARKLY_CLIENT_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_BUSINESS_UPGRADE_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
