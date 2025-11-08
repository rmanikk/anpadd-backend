import jwt from "jsonwebtoken";

export const AuthApi = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token)

    if (!token) {
      return res.send("token is not found ");
    }

    const decodetokendata = await jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log(decodetokendata);

    req.userid = decodetokendata.id;

    next();
  } catch (error) {
    console.log(error);
  }
};