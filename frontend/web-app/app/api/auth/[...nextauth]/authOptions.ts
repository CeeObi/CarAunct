import { NextAuthOptions } from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import GithubProvider from "next-auth/providers/github";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates (use in development only)
    keepAlive: true, // Reuse TCP connections for performance
    timeout: 50000, // Timeout for the socket (10 seconds)
    maxSockets: 10, // Maximum concurrent connections
});

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        DuendeIdentityServer6({
            id: "id-server",
            clientId: "nextApp",
            // authorization: 'https://idnttyy-svc-latest.onrender.com/connect/authorize',
            clientSecret: `secret`, // "serversecret", - Ensure this is secured and not hard-coded in production
            wellKnown: process.env.ID_URL + "/.well-known/openid-configuration", //"http://localhost:5000/.well-known/openid-configuration",  // Discovery document URL
            issuer: process.env.ID_URL, // "http://localhost:5000", Identity Server URL
            httpOptions: {
                agent, // Use the httpsAgent
                timeout: 50000,
            },
            userinfo: process.env.ID_URL + "/connect/userinfo",
            authorization: {
                params: {
                    scope: "openid profile auctionApp", // Ensure these scopes are allowed in IdentityServer
                    redirect_uri: process.env.CLIENT_APP + "/api/auth/callback/id-server", //Should match your IdentityServer configuration
                },
                // url: `${process.env.ID_URL}/connect/authorize`, // Authorization URL
                url: process.env.ID_URL + "/connect/authorize",
            },
            token: process.env.ID_URL + "/connect/token",
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
            clientId: `${process.env.GITHUB_CLIENT_ID}`, //"Ov23liyzusdKTLfLF4o6" -
            clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`, // "see env", //
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

    //Set cookies
    cookies: {
        // sessionToken: {
        //     name: `__Secure-next-auth.session-token`,
        //     options: {
        //         httpOnly: false,
        //         sameSite: "none",
        //         secure: true, // Ensure cookies are sent only over HTTPS
        //     },
        // },
        callbackUrl: {
            name: `__Secure-next-auth.callback-url`,
            options: {
                sameSite: "none",
                secure: false, // Ensure cookies are sent only over HTTPS
            },
        },
        // csrfToken: {
        //     name: `__Host-next-auth.csrf-token`,
        //     options: {
        //         sameSite: "none",
        //         secure: false, // Ensure cookies are sent only over HTTPS
        //     },
        // },
    },
    ////
    // Enable debug mode
    debug: true,

    callbacks: {
        async jwt({ token, profile, account }) {
            if (profile) {
                if (account?.provider === "github" && profile?.login) {
                    // Add GitHub username to the token
                    token.username = profile.login;
                } else {
                    token.username = profile.username; // Store the username in the token
                }
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
        async redirect({ url, baseUrl }) {
            // console.log("*******************");
            // console.log("---->>> Redirect callback: ", url, baseUrl);
            // console.log("*******************");
            var redirectUrl = url.startsWith(baseUrl) ? url : baseUrl;
            redirectUrl = redirectUrl.split("//")[1];
            return process.env.APP_PROTOCOL + redirectUrl;
        },
    },

    pages: {
        signIn: "/api/auth/signin", //folder with pages.tsx file to return if
    },
};

export { authOptions };
