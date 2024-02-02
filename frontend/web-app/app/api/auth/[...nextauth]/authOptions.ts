import { NextAuthOptions } from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6"


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
                redirect_uri: process.env.ID_REDIRECT_URL//Tobe modified for container deploy
            }},
            idToken: true
        })
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
        }
    },    
}



export {authOptions};