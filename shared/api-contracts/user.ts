// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  updatedAt: number;
};

// -----------------------------------------------------------------
// Create User Contracts
// -----------------------------------------------------------------

export type CreateUserRequestBody = {
  firstName: string;
  lastName: string;
};

export type CreateUserResponseBody = {
  user: User;
};

// -----------------------------------------------------------------
// Update User Contracts
// -----------------------------------------------------------------

export type UpdateUserRequestParam = {
  id: string;
};

export type UpdateUserRequestBody = {
  firstName?: string;
  lastName?: string;
};

export type UpdateUserResponseBody = {
  user: User;
};
