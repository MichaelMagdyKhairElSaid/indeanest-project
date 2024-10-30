import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../utils/middleware/catchAsyncError.js";
import userModel,{IUser} from "../../database/models/user.model.js";
import AppError from "../../utils/services/AppError.js";
import jwt from "jsonwebtoken";
import redis from "../../utils/services/redisService.js";

// Interfaces for request bodies
interface SignUpRequest extends Request {
  body: { email: string; password: string; name: string; access_level: string };
}
interface SignInRequest extends Request {
  body: { email: string; password: string };
}
// interface RefreshTokenRequest extends Request {
//   body: { refresh_token: string };
// }
interface AuthenticatedRequest extends Request {
  user?: IUser;
  decoded?: object;
}
export const signup = catchAsyncError(async (req: SignUpRequest, res: Response, next: NextFunction) => {
  const isFound = await userModel.findOne({ email: req.body.email });

  if (isFound) return next(new AppError("User already registered", 409));

  // Save to database
  let result = new userModel(req.body);
  result = await result.save();
  res.status(201).json({ message: "Done" });
});

export const signIn = catchAsyncError(async (req: SignInRequest, res: Response, next: NextFunction) => {
  const isFound = await userModel.findOne({ email: req.body.email });
  if (!isFound) return next(new AppError("User not found, please sign up", 404));
  if (isFound.password !== req.body.password) return next(new AppError("Invalid password", 401));

  const user:any = isFound.toObject();
  delete user.__v;
  delete user.password;

  const token = jwt.sign({ ...user }, process.env.SECRET_KEY as string, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET_KEY as string, { expiresIn: "1d" });

  res.status(201).json({ message: "Done", access_token: token, refresh_token: refreshToken });
});

export const refresh_token = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return next(new AppError("Access Denied. No refresh token provided", 401));

  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET_KEY as string) as jwt.JwtPayload;
    delete decoded.iat;
    delete decoded.exp;

    const accessToken = jwt.sign({ ...decoded }, process.env.SECRET_KEY as string, { expiresIn: "1h" });
    res.status(201).json({ message: "Done", access_token: accessToken, refresh_token: refresh_token });
  } catch (error) {
    return next(new AppError("Invalid refresh token", 400));
  }
});

export const protectRoutes = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let Authorization = req.headers['authorization'];
  if (!Authorization || !Authorization.startsWith("Bearer")) {
    return next(new AppError('please provide valid token', 401));
  }

  const token:string = Authorization.split(" ")[1];
  const decoded:any = jwt.verify(token, process.env.SECRET_KEY as string);
  if (!decoded) return next(new AppError("invalid or expired token", 401));

  const user = await userModel.findById(decoded._id);
  if (!user) return next(new AppError("invalid user", 404));

  req.user = user;
  req.decoded = decoded;
  next();
});

export const revokedRefreshToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return next(new AppError("Refresh token is required", 400));

  const isTokenRevoked = await redis.isTokenRevoked(refresh_token);
  if (isTokenRevoked) return next(new AppError("Refresh token is already revoked", 400));

  const result = await redis.revokeToken(refresh_token);
  return res.status(201).json({ message: "Refresh token revoked successfully",result });
});
