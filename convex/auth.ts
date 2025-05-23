import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { ResendOTPPasswordReset } from "./passwordReset/ResendOTPPasswordReset";
import { ResendOTP } from "./otp/ResendOTP";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile(githubProfile) {
        return {
          id: githubProfile.id.toString(),
          email: githubProfile.email,
          firstName: githubProfile.name ? githubProfile.name.split(" ")[0] : "",
          lastName: githubProfile.name ? githubProfile.name.split(" ")[1] : "",
          image: githubProfile.avatar_url,
        };
      }
    }),
    Google({
      profile(googleProfile) {
        return {
          id: googleProfile.id,
          email: googleProfile.email,
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
          image: googleProfile.picture,
        };
      }
    }),
    Password({
      id: "password-code",
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
      profile(params) {
        return {
          email: params.email as string,
          firstName: params.firstName as string,
          lastName: params.lastName as string,
        };
      }
    })
  ],
});
