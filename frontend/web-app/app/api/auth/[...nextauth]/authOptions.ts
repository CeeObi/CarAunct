import { NextAuthOptions } from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6"
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
            id: 'github',
            // name: 'GitHub',
            // type: 'oauth',
            // version: '2.0',
            // scope: 'user',
            // params: { grant_type: 'authorization_code' },
            // accessTokenUrl: 'https://github.com/login/oauth/access_token',
            // authorizationUrl: 'https://github.com/login/oauth/authorize',
            clientId: "Ov23liyzusdKTLfLF4o6",//process.env.GITHUB_CLIENT_ID,
            clientSecret: "ee27356fa4f822432322d6e0735238d465d158c4",//process.env.GITHUB_CLIENT_SECRET,
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
        signIn:"/api/auth/signin",        
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
        }
    },    
}



export {authOptions};
