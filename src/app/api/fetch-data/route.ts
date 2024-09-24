import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { users } from "@/db/schema"; // Adjust the import path as needed
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { OAuth2Client } from "google-auth-library";
import { oAuth2Client } from "../auth/google/route";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URIS;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const fitness = google.fitness({
  version: "v1",
  auth: oauth2Client,
});

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is missing somehow?!" },
      { status: 400 }
    );
  }

  try {
    // Fetch the refresh token from the database
    const user = await db
      .select({ refreshToken: users.googleRefreshToken })
      .from(users)
      .where(eq(users.googleuserID, userId))
      .limit(1);

    if (!user || !user[0].refreshToken) {
      return NextResponse.json(
        { error: "User not found or refresh token missing" },
        { status: 404 }
      );
    }

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: user[0].refreshToken,
    });

    // Get a fresh access token
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: 500 }
      );
    }

    // Set the scopes for the data you want to fetch
    const dataTypes = [
      { dataTypeName: "com.google.step_count.delta" },
      { dataTypeName: "com.google.blood_glucose" },
      { dataTypeName: "com.google.blood_pressure" },
      { dataTypeName: "com.google.heart_rate.bpm" },
      { dataTypeName: "com.google.weight" },
      { dataTypeName: "com.google.height" },
      { dataTypeName: "com.google.sleep.segment" },
      { dataTypeName: "com.google.body.fat.percentage" },
    ];

    // Set the time range for the data (e.g., last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const datasets = await Promise.all(
      dataTypes.map(async (dataType) => {
        try {
          const response = await fitness.users.dataSources.datasets.get({
            userId: "me",
            dataSourceId: `derived:${dataType.dataTypeName}:com.google.android.gms:merged`,
            datasetId: `${sevenDaysAgo.getTime() * 1000000}-${
              now.getTime() * 1000000
            }`,
          });

          if (response.data.point && response.data.point.length === 0) {
            console.log(`No data points found for ${dataType.dataTypeName}`);
          }

          return {
            dataType: dataType.dataTypeName,
            data: response.data,
          };
        } catch (error) {
          console.error(`Error fetching ${dataType.dataTypeName}:`, error);
          return {
            dataType: dataType.dataTypeName,
            error: "Failed to fetch data",
          };
        }
      })
    );

    return NextResponse.json({ datasets });
  } catch (error) {
    console.error("Error fetching Google Fit data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
