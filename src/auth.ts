// auth.ts
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { authConfig } from "./auth.config";
import { db } from "./lib/db";
import z from "zod";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

const DUMMY_HASH =
  "$2b$10$e8T.s1W7Sg.s4N0w4z.G8eM6T9iS8A1oW7G0s1N0w4z.G8eM6T9iS";

const credentialsSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            password: true,
            image: true,
            bio: true,
            emailVerified: true,
          },
        });

        const hashToCompare = user?.password || DUMMY_HASH;

        const isPasswordValid = await bcrypt.compare(password, hashToCompare);

        if (!user || !user.password || !isPasswordValid) {
          return null;
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          bio: user.bio,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.image = user.image;
        token.bio = user.bio;
        token.emailVerified = user.emailVerified
          ? new Date(user.emailVerified)
          : null;
      }

      if (trigger === "update" && session?.user) {
        if (typeof session.user.name === "string")
          token.name = session.user.name;
        if (typeof session.user.username === "string")
          token.username = session.user.username;
        if (typeof session.user.image === "string")
          token.image = session.user.image;
        if (typeof session.user.bio === "string") token.bio = session.user.bio;
        if (session.user.emailVerified) {
          token.emailVerified = new Date(session.user.emailVerified);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.image = token.image as string;
        session.user.bio = token.bio as string;
        (session.user as any).emailVerified = token.emailVerified;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
