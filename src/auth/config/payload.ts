export type RefreshPayload = {
  sub: string;
  email: string;
  exp: string;
  iat: string;
};

export type AccessPayload = {
  sub: string;
  exp?: string;
  iat?: string;
};
