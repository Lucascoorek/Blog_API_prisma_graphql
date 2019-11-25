import jwt from "jsonwebtoken";

const generateToken = id => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1 day"
  });
};

export default generateToken;
