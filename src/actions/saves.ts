import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, InferModel } from "drizzle-orm";

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
