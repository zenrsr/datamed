import { NextRequest, NextResponse } from "next/server";
import { google, fitness_v1 } from "googleapis";
import { SCOPES } from "@/constants";

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URIS
);

export async function GET(request: NextRequest, response: NextResponse) {
  // Here you can add any logic to fetch data or perform actions
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return NextResponse.redirect(new URL(authUrl));
}
