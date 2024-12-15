type AccessToken = {
  access_token: string;
};

type AccessTokenPayload = {
  user_name: string;
  email: string;
  user_id: number;
};

export { AccessToken, AccessTokenPayload };
