import passport from "passport";
import { createJwtStrategy } from "./authStrategies/jwtStrategy";
import { createGoogleStrategy } from "./authStrategies/googleStrategy";
import { userService as UserService } from "../../composition/user";
import { IAuthUser } from "../../services/interfaces/iAuthUser";
const userService: IAuthUser = UserService;
passport.use("jwt", createJwtStrategy(userService));
passport.use("google", createGoogleStrategy(userService));

export default passport;
