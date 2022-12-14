import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "changme";

export function signJwt(data: Object) {
  return jwt.sign(data, SECRET);
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T;
}

export function decodeJwt<T>(token: string) {
  return jwt.decode(token) as T;
}
