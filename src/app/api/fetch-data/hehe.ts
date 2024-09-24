import { fitness_v1, google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { oAuth2Client } from "../auth/google/route";
import { getTokensFromDatabase, getUserProfile } from "@/actions";
import { GaxiosResponse } from "gaxios";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Starting GET request");

  try {
    const profile = await getUserProfile(oAuth2Client);
    const tokens = await getTokensFromDatabase(String(profile.userID));

    if (!tokens) {
      console.log("No tokens found in the database");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    oAuth2Client.setCredentials(tokens);

    // Check if the access token is expired and refresh if necessary
    if (Date.now() > tokens.expiry_date) {
      console.log("Token expired, refreshing...");
      const { credentials } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(credentials);

      // Update the tokens in the database
      try {
        await db
          .update(users)
          .set({
            googleAccessToken: credentials.access_token!,
            googleRefreshToken:
              credentials.refresh_token || tokens.refresh_token,
            tokenExpiry: credentials.expiry_date
              ? new Date(credentials.expiry_date)
              : new Date(Date.now() + 3600 * 1000),
            tokenUpdatedAt: new Date(),
          })
          .where(eq(users.googleuserID, String(profile.userID)));
        console.log("Tokens updated in database");
      } catch (error) {
        console.error("Error updating user tokens:", error);
        // You might want to handle this error, perhaps by returning an error response
        return NextResponse.json(
          { error: "Failed to update user tokens" },
          { status: 500 }
        );
      }
    }

    // Now you can use the authenticated oAuth2Client to get the user profile and fitness data
    const userProfileData = await getUserProfile(oAuth2Client);
    console.log("User profile data:", userProfileData);

    console.log("Initializing Google Fitness API");
    const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

    const fourteenDaysInMillis = 14 * 24 * 60 * 60 * 1000;
    const startTimeMillis = Date.now() - fourteenDaysInMillis;
    const endTimeMillis = Date.now();
    console.log("Time range:", { startTimeMillis, endTimeMillis });

    const params: fitness_v1.Params$Resource$Users$Dataset$Aggregate = {
      userId: "me",
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.blood_glucose" },
          { dataTypeName: "com.google.blood_pressure" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.weight" },
          { dataTypeName: "com.google.height" },
          { dataTypeName: "com.google.sleep.segment" },
          { dataTypeName: "com.google.body.fat.percentage" },
        ],
        bucketByTime: { durationMillis: "86400000" },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    };
    console.log("Aggregate params:", params);

    console.log("Fetching fitness data");
    const response: GaxiosResponse<fitness_v1.Schema$AggregateResponse> =
      await fitness.users.dataset.aggregate(params);
    console.log("Fitness API response status:", response.status);

    const fitnessData = response.data.bucket ?? [];
    console.log("Number of data buckets:", fitnessData.length);

    // Process and format the fitness data
    const formattedData = fitnessData.map(
      (data: fitness_v1.Schema$AggregateBucket) => {
        const formattedDate = new Date(
          parseInt(data.startTimeMillis || "0")
        ).toDateString();
        const formattedEntry = {
          date: formattedDate,
          step_count: 0,
          glucose_level: 0,
          blood_pressure: [0, 0],
          heart_rate: 0,
          weight: 0,
          height_in_cms: 0,
          sleep_hours: 0,
          body_fat_in_percent: 0,
          menstrual_cycle_start: "",
        };

        data.dataset?.forEach((dataset) => {
          const dataTypeName = dataset.dataSourceId?.split(":")[1];
          dataset.point?.forEach((point) => {
            const value = point.value;
            switch (dataTypeName) {
              case "com.google.step_count.delta":
                formattedEntry.step_count += value?.[0]?.intVal || 0;
                break;
              // Add cases for other data types
              // ...
            }
          });
        });

        return formattedEntry;
      }
    );

    console.log("All formatted fitness data:", formattedData);

    console.log("Sending response");
    return NextResponse.json({
      userName: userProfileData.displayName,
      profilePhoto: userProfileData.profilePhotoUrl,
      userId: userProfileData.userID,
      formattedData,
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    return NextResponse.json(
      { error: "Failed to fetch fitness data" },
      { status: 500 }
    );
  }
}
