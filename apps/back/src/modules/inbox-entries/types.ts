export interface PrimaryKeyFields {
  id: number;
}

export interface RequiredFields {
  userId: number;
}

export interface GetAllFilterParams extends RequiredFields {}
