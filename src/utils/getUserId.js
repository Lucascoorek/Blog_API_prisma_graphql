import jwt from "jsonwebtoken";

const getUserId = request => {
  const headers = request.request.headers.authorization;

  if (!headers) throw new Error("Authentication required");

  const token = headers.replace("Bearer ", "");
  const decoded = jwt.verify(token, "thisisasecret");
  return decoded.userId;
};
export default getUserId;
