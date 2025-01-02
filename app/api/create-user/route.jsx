import { NextResponse } from "next/server";
import { db } from "../../../configs/db"
import { USER_TABLE } from "../../../configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
      const { user } = await req.json();
      console.log('Parsed user data:', user);
  
      if (!user || !user.id || !user.email || !user.username) {
        console.log('Invalid user data:', user);
        return NextResponse.json({ error: "Invalid user data provided" }, { status: 400 });
      }
  
      // Check if the user already exists in the database
      const existingUser = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.userId, user.id))
        .limit(1);
  
      // If the user already exists, return their current data
      if (existingUser.length > 0) {
        console.log('User already exists:', existingUser[0]);
        return NextResponse.json({ 
          message: "User already exists",
          user: existingUser[0]
        });
      }
  
      // Make sure we have a valid role, defaulting to 'user' if none provided
      const role = user.role || 'user';
  
      // Insert the new user into the database
      const newUser = await db.insert(USER_TABLE).values({
        userId: user.id,
        email: user.email,
        userName: user.username,
        role: role,
      }).returning();
  
      console.log('User created successfully:', newUser[0]);
  
      return NextResponse.json({ 
        message: "User created successfully",
        user: newUser[0]
      });
  
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}