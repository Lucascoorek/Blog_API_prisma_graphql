import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const headers = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (headers) {
    const token = headers.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }

  if (requireAuth) throw new Error("Authentication required");

  return null;
};
export default getUserId;
