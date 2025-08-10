import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'BUYER' | 'VENDOR'
    } & DefaultSession["user"];
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }

  interface User {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'BUYER' | 'VENDOR'
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'BUYER' | 'VENDOR'
    };
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}