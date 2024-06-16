export const COOKIE_SETTINGS = {
  REFRESH_TOKEN: {
    httpOnly: true,
    // maxAge: 1 * 24 * 60 * 60 * 1000, //1d
    maxAge: 1 * 60 * 1000, //1d
  },
};
// export const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; //15m
export const ACCESS_TOKEN_EXPIRATION = 1 * 30 * 1000; //15m
