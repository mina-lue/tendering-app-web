import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials'
import { backend_url } from "./constants";


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
                        name: user.user.name,
                        role: user.user.role
                    },
                    backendTokens: {
                        accessToken: user.backendTokens.accessToken,
                        refreshToken: user.backendTokens.refreshToken,
                        expiresIn:user.backendTokens.expiresIn
                    }
                };
            }
            if(new Date().getTime() < token.backendTokens.expiresIn)
            return token;

            return await refreshToken(token);
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

async function refreshToken(token: JWT): Promise<JWT>{
    const res = await fetch(backend_url + "/api/auth/refresh", {
        method: 'POST',
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`
        }
    })

    console.log('refreshed')

    const response = await res.json();

    return {
        ...token,
        backendTokens: response
    }
}