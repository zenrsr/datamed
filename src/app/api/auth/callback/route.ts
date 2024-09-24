import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { oAuth2Client } from "../google/route";
import { getUserProfile, saveDB, UserProfile } from "@/actions";
// Define the shape of your session
interface SessionData {
  tokens?: any;
  userProfile?: UserProfile;
}

const sessionOptions = {
  cookieName: "myapp_cookiename",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "development",
  },
};

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  const code = req.nextUrl.searchParams.get("code") as string;

  if (!code) {
    return NextResponse.redirect(new URL("/error", req.url));
  }

  try {
    // Get OAuth tokens using the authorization code
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Fetch user profile data
    const profile = await getUserProfile(oAuth2Client);

    // Store tokens and user profile in the session
    session.tokens = tokens;
    session.userProfile = profile;

    // Save the session
    await session.save();

    const resposne = await saveDB({
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token,
      tokenExpiry: tokens.expiry_date,
      displayName: profile.displayName,
      profilePhotoUrl: profile.profilePhotoUrl,
      userID: profile.userID,
    });

    if (resposne?.status === 200) {
      console.log({
        title: resposne.message,
      });
    } else if (resposne?.status === 201) {
      console.log({
        title: resposne.message,
      });
    }

    // Log for debugging
    // console.log("Tokens:", tokens);
    console.log("User Profile:", profile);
    // console.log(req.url);

    // Redirect to the /api/fetch-data
    return NextResponse.redirect(
      new URL(`/api/fetch-data?userId=${profile.userID}`, req.url)
    );
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
}
