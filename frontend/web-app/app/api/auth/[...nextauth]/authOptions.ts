import { NextAuthOptions } from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import GithubProvider from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        DuendeIdentityServer6({
            id: "id-server",
            clientId: "nextApp",
            clientSecret: "secret", // Ensure this is secured and not hard-coded in production
            wellKnown: "http://localhost:5000/.well-known/openid-configuration", // Discovery document URL
            issuer: "http://localhost:5000", // Identity Server URL
            authorization: {
                params: {
                    scope: "openid profile auctionApp", // Ensure these scopes are allowed in IdentityServer
                    redirect_uri: "http://localhost:3000/api/auth/callback/id-server", // Should match your IdentityServer configuration
                },
            },
            idToken: true, // Setting to true if you need ID token
        }),

        // {
        //     id: 'google',
        //     name: 'Google',
        //     type: 'oauth',
        //     version: '2.0',
        //     scope: 'openid email profile',
        //     params: { grant_type: 'authorization_code' },
        //     accessTokenUrl: 'https://oauth2.googleapis.com/token',
        //     authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //   },

        GithubProvider({
            id: "github",
            // name: 'GitHub',
            // type: 'oauth',
            // version: '2.0',
            // scope: 'user',
            // params: { grant_type: 'authorization_code' },
            // accessTokenUrl: 'https://github.com/login/oauth/access_token',
            // authorizationUrl: 'https://github.com/login/oauth/authorize',
            clientId: "Ov23liyzusdKTLfLF4o6", //process.env.GITHUB_CLIENT_ID,
            clientSecret: "ee27356fa4f822432322d6e0735238d465d158c4", //process.env.GITHUB_CLIENT_SECRET,
        }),

        // GoogleProvider({
        // clientId: process.env.GOOGLE_CLIENT_ID,
        // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // profile(profile) {
        //     return { profile
        //     // Return all the profile information you need.
        //     // The only truly required field is `id`
        //     // to be able identify the account when added to a database
        //     }
        // },
        // })
    ],

    callbacks: {
        async jwt({ token, profile, account }) {
            if (profile) {
                token.username = profile.username; // Store the username in the token
            }
            if (account) {
                token.access_token = account.access_token; // Store the access token
            }
            return token; // Return the updated token
        },
        async session({ session, token }) {
            if (token) {
                session.user.username = token.username; // Add username to the session
            }
            return session; // Return the updated session
        },
    },

    pages: {
        signIn: "/api/auth/signin", //folder with pages.tsx file to return if
    },
};

export { authOptions };
