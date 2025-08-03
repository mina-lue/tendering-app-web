import { backend_url } from "../../../../lib/constants";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "text",
                    placeholder: "jsmith"
                },
                password: { label: "password", type: "password"}
            },
            async authorize(credentials, req){
                if(!credentials?.email || !credentials?.password) return null;
                const {email, password} = credentials;

                const res = await fetch(backend_url + "/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
                if(res.status == 401){
                    console.log(res.statusText)
                    return null;
                }
                const user = await res.json();
                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/signin'
    },
    callbacks: {
        async jwt({token, user}){
            if(user) {
                return {
                    ...token,
                    user: {
                        id: user.user.id,
                        email: user.user.email,
                        name: user.user.name
                    },
                    backendTokens: {
                        accessToken: user.backendTokens.accessToken,
                        refreshToken: user.backendTokens.refreshToken
                    }
                };
            }
            return token;
        },

        async session({token, session}){
            if (token) {
                session.user = token.user;
                session.backendTokens = token.backendTokens;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST};
