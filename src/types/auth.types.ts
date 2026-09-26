export interface AccessTokenPayload {
  id: number;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: number;
}
