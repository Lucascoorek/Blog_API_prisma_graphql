import jwt from "jsonwebtoken";

const generateToken = id => {
  return jwt.sign({ userId: id }, "thisisasecret", {
    expiresIn: "1 day"
  });
};

export default generateToken;
