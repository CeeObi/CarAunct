/** @type {import('next').NextConfig} */
const nextConfig = {
//     experimental:{
//         serverActions:true,
//     },
    images:{
        domains: ["cdn.pixabay.com","media.istockphoto.com"]
    },
    env:{
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, //Need to make this acces from the .env file later
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
    },
    reactStrictMode: false,
    output: "standalone"
}

module.exports = nextConfig
