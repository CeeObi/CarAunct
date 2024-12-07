/** @type {import('next').NextConfig} */
const nextConfig = {
    //     experimental:{
    //         serverActions:true,
    //     },
    output: "standalone",
    images: {
        domains: ["cdn.pixabay.com", "media.istockphoto.com", "carma.com.au", "carsales.pxcrush.net"],
    },

    env: {
        NEXTAUTH_SECRET: process.env.CLIENT_SECRET, // "secret"
        NEXTAUTH_URL: process.env.CLIENT_APP,
    },
    reactStrictMode: false,
    publicRuntimeConfig: {
        protocol: "https",
    },
};

module.exports = nextConfig;
