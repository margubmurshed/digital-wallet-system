import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { UserStatus } from "../modules/user/user.interface";

passport.use(
    new LocalStrategy({
        usernameField: "phone",
        passwordField: "password"
    }, async (phone: string, password: string, done) => {
        const user = await User.findOne({ phone });
        
        if (!user) return done(null, false, { message: "User doesn't exist with this phone number!" });
        if (user.status === UserStatus.BLOCKED) return done("User is blocked");

        const isPasswordMatched = await user.isPasswordMatched(password);
        if (!isPasswordMatched) return done(null, false, { message: "Password is incorrect!" })
        
        return done(null, user);
    }))
