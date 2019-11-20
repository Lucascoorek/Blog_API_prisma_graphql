import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const headers = request.request.headers.authorization;

  if (headers) {
    const token = headers.replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisasecret");
    return decoded.userId;
  }

  if (requireAuth) throw new Error("Authentication required");

  return null;
};
export default getUserId;
