import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        // Check if this user should be an admin based on environment variable
        let roleToSet = "USER";
        if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
          roleToSet = "ADMIN";
        }

        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          { 
            name: user.name, 
            image: user.image,
            $setOnInsert: { role: roleToSet }
          },
          { upsert: true, new: true }
        );
        token.id = dbUser._id.toString();
        token.role = dbUser.role || "USER";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
