export interface PrimaryKeyFields {
  id: number;
}

// biome-ignore lint/suspicious/noEmptyInterface: Empty object which should be extended
export interface RequiredFields {}

export interface GetAllFilterParams extends RequiredFields {}

export interface CreateOrModifyUserRepository {
  email: string;
  username: string;
  passwordHash: string;
  passwordSalt: string;
}
