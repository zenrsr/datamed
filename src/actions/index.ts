import { useUser } from "@clerk/nextjs";
import { google } from "googleapis";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq, InferModel } from "drizzle-orm";
import { db } from "@/db";

export interface UserProfile {
  displayName: string;
  profilePhotoUrl: string;
  userID: number;
}

export const checkUserStatus = () => {
  const { isLoaded, isSignedIn } = useUser();
  if (isLoaded && isSignedIn) {
    return true;
  }
  return false;
};

export const getUserProfile = async (auth: any): Promise<UserProfile> => {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  const displayName = profile.data.names?.[0]?.displayName || "";
  const url = profile.data.photos?.[0]?.url || "";
  const userID = parseInt(
    profile.data.resourceName?.replace("people/", "") || "0",
    10
  );

  return { displayName, profilePhotoUrl: url, userID };
};

export async function getTokensFromDatabase(googleuserID: string) {
  try {
    const user = await db
      .select({
        accessToken: users.googleAccessToken,
        refreshToken: users.googleRefreshToken,
        tokenExpiry: users.tokenExpiry,
      })
      .from(users)
      .where(eq(users.googleuserID, googleuserID))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user || !user.accessToken) {
      console.error("User or access token not found for ID:", googleuserID);
      throw new Error("User tokens not found");
    }

    console.log("Fetched tokens from database for user ID:", googleuserID);
    return {
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
      expiry_date: user.tokenExpiry.getTime(),
    };
  } catch (error) {
    console.error("Error fetching tokens from database:", error);
    throw error;
  }
}

// Infer the type for insert operations from the users table
type UserInsertType = InferModel<typeof users, "insert">;

type TokenProps = {
  accessToken: string;
  refreshToken: string | undefined | null;
  tokenExpiry: number | undefined | null;
  displayName: string;
  profilePhotoUrl: string;
  userID: number;
};

// Function to save user data into the database
export const saveDB = async ({
  accessToken,
  refreshToken,
  tokenExpiry,
  displayName,
  profilePhotoUrl,
  userID: googleuserID, // renamed to googleuserID as per schema
}: TokenProps) => {
  try {
    // Align field names and types with schema
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.googleuserID, String(googleuserID)))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(
        `User with googleuserID ${googleuserID} already exists. Updating...`
      );
      const updatedResponse = await db
        .update(users)
        .set({
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken || "",
          tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : null,
          updatedAt: new Date(),
        } as UserInsertType)
        .where(eq(users.googleuserID, String(googleuserID)));

      return {
        status: 201,
        message: "User successfully updated",
        response: updatedResponse,
      };
    } else {
      const response = await db.insert(users).values({
        displayName,
        profilePhotoUrl,
        googleuserID: String(googleuserID),
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken || "",
        tokenExpiry: tokenExpiry ? new Date(tokenExpiry) : null,
        createdAt: new Date(),
      } as UserInsertType);
      return {
        status: 200,
        message: "User successfully created",
        response: response,
      };
    }
  } catch (error) {
    console.error("Error inserting into DB:", error);
  }
};
