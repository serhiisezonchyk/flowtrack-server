"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_TOKEN_EXPIRATION = exports.COOKIE_SETTINGS = void 0;
exports.COOKIE_SETTINGS = {
    REFRESH_TOKEN: {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, //1d
    },
};
exports.ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; //15m
