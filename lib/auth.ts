import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  code: z.string().optional(),
});

const hasDB = !!process.env.DATABASE_URL;

const nextAuthResult = NextAuth({
  ...authConfig,
  adapter: hasDB ? PrismaAdapter(prisma) : undefined,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    Resend({
      apiKey: process.env.RESEND_API_KEY as string,
      from: process.env.RESEND_FROM_EMAIL as string,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password, code } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        // 2FA Validation
        if (user.twoFactorEnabled) {
          if (!code) {
            throw new Error("Requires2FA");
          }

          // Verify email OTP code
          const verificationToken = await prisma.verificationToken.findUnique({
            where: {
              identifier_token: {
                identifier: `${user.email}_2fa_login`,
                token: code,
              },
            },
          });

          let isValid = false;

          if (verificationToken && verificationToken.expires >= new Date()) {
            isValid = true;
            // Clean up used token
            await prisma.verificationToken.delete({
              where: {
                identifier_token: {
                  identifier: `${user.email}_2fa_login`,
                  token: code,
                },
              },
            });
          } else if (user.backupCodes.includes(code)) {
            isValid = true;
            // Remove used backup code
            await prisma.user.update({
              where: { id: user.id },
              data: {
                backupCodes: {
                  set: user.backupCodes.filter((c: string) => c !== code),
                },
              },
            });
          }

          if (!isValid) {
            throw new Error("Invalid2FACode");
          }
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          tier: user.tier,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (!user.email) return false;

      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          // Instead of creating the user, redirect them to sign up form with prefilled data
          return `/login?tab=signup&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || "")}`;
        }
      }

      // Block sign-in if email not verified for credentials provider
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!dbUser?.emailVerified) {
          // Allow for now - in production, enforce email verification
          return true;
        }
      }

      return true;
    },
  },

  events: {
    async signIn({ user }) {
      if (user.id) {
        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {}); // Non-critical

        // Log actual login history
        try {
          const reqHeaders = await headers();
          const userAgent = reqHeaders.get("user-agent") || "Unknown Browser";
          
          const ipAddress = 
            reqHeaders.get("x-forwarded-for")?.split(",")[0] || 
            reqHeaders.get("x-real-ip") || 
            "Unknown IP";

          let browser = "Unknown";
          if (userAgent.includes("Chrome")) browser = "Chrome";
          else if (userAgent.includes("Firefox")) browser = "Firefox";
          else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
          else if (userAgent.includes("Edge")) browser = "Edge";

          let os = "Unknown";
          if (userAgent.includes("Windows")) os = "Windows";
          else if (userAgent.includes("Mac OS")) os = "macOS";
          else if (userAgent.includes("Linux")) os = "Linux";
          else if (userAgent.includes("Android")) os = "Android";
          else if (userAgent.includes("iOS")) os = "iOS";

          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              ipAddress: ipAddress.substring(0, 45), // Safe IPv6 length
              userAgent: userAgent,
              browser,
              os,
              success: true,
            }
          });
        } catch (error) {
          console.error("Failed to log login history:", error);
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
});

export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;

export const auth = (...args: any[]): any => {
  const isMiddleware = args.length > 0 && typeof args[0] === "function";
  
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === "development") {
    if (isMiddleware) {
      // If used as middleware, just bypass protection by running the callback with a mock session
      const callback = args[0];
      return async (req: any, ctx: any) => {
        req.auth = {
          user: {
            id: "mock-user-id",
            name: "UI Designer",
            email: "designer@validexio.com",
            tier: "PRO",
            role: "USER"
          },
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
        };
        return callback(req, ctx);
      };
    }

    // Normal session fetch
    return Promise.resolve({
      user: {
        id: "mock-user-id",
        name: "UI Designer",
        email: "designer@validexio.com",
        tier: "PRO",
        role: "USER"
      },
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    });
  }
  
  return (nextAuthResult.auth as any)(...args);
};
