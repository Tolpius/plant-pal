import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export const authOptions = {
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? CredentialsProvider({
          name: "credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "username",
            },
            password: {
              label: "Password",
              type: "password",
              placeholder: "password",
            },
          },
          async authorize(credentials) {
            // Simulated login depending on environment
            if (
              credentials.username === process.env.PREVIEW_USER_USERNAME &&
              credentials.password === process.env.PREVIEW_USER_PASSWORD
            ) {
              // Object for Session and DB
              return {
                name: "Neuer Fisch",
                email: "test@example.com",
                id: process.env.PREVIEW_USER_ID,
                provider: "preview_credentials",
              };
            }
            return null;
          },
        })
      : GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      // Google: Look for Provider + providerAccountId
      // Credentials (Preview): use user.id as unique identifier
      let query;
      if (account) {
        query = {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        };
      } else {
        query = { provider: user.provider, providerAccountId: user.id };
      }

      let dbUser = await User.findOne(query);

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image || null,
          provider: account?.provider || "preview_credentials",
          providerAccountId: account?.providerAccountId || user.id,
          role: "user",
          isDarkMode: false,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: user?.email || token.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.isDarkMode = dbUser.isDarkMode;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isDarkMode = token.isDarkMode;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
