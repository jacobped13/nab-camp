// -----------------------------------------------------------------
// Send Email Authentication Code Contracts
// -----------------------------------------------------------------

export type SendEmailAuthenticationCodeRequestBody = {
  email: string;
};

export type SendEmailAuthenticationCodeResponseBody = {
  email: string;
  // Included in development environment for testing purposes
  code?: string;
};

// -----------------------------------------------------------------
// Accept Email Authentication Code Contracts
// -----------------------------------------------------------------

export type AcceptEmailAuthenticationCodeRequestBody = {
  email: string;
  code: string;
};

export type AcceptEmailAuthenticationCodeResponseBody = {
  token: string;
};
