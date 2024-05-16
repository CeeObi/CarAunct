import { NextAuthOptions } from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"



const authOptions : NextAuthOptions = {
    session:{
        strategy:"jwt",
    },

    providers:[
        DuendeIdentityServer6({
            id:"id-server",  
            clientId: "nextApp",
            clientSecret: "secret",
            issuer: process.env.ID_URL,//Identity server url
            authorization: {params: {
                scope: "openid profile auctionApp",
                redirect_uri: "https://carsbidi.onrender.com/api/auth/callback/id-server"//process.env.ID_REDIRECT_URL//Tobe modified for container deploy
            }},
            idToken: true
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          })
        
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
    
    pages: {
        signIn:"/api/auth/signin"
    }, 

    callbacks:{
        async jwt({token, profile, account}){
            if (profile){
                token.username = profile.username //module augmentation was used to modify and add the property 'username'
            }
            
            if (account){
                token.access_token = account.access_token //module augmentation was used to modify and add the property 'username'
            }
            return token
        },
        async session({session, token}){
            if (token){
                session.user.username = token.username //implemented module augmentation to add the username property in next-auth.d.ts
            }
            return session
        },
        // async redirect({url, baseUrl}) {
        //     console.log('url', url);
        //     console.log('baseUrl', baseUrl);            
        //     return url                
        // },
        // async redirect({ url, baseUrl }) {
        //     // Allows relative callback URLs
        //     if (url.startsWith("/")) return "https://carsbidi.onrender.com/api/auth/callback/id-server"//`${baseUrl}${url}`
        //     // Allows callback URLs on the same origin
        //     else if (new URL(url).origin === baseUrl) return "https://carsbidi.onrender.com/api/auth/callback/id-server"//url
        //     return "https://carsbidi.onrender.com/api/auth/callback/id-server"
        // }        
    },    
}



export {authOptions};
