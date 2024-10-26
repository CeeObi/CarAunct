/** @type {import('next').NextConfig} */
const nextConfig = {
    //     experimental:{
    //         serverActions:true,
    //     },
    output: "export",
    images: {
        domains: ["cdn.pixabay.com", "media.istockphoto.com", "carma.com.au", "carsales.pxcrush.net"],
    },

    env: {
        NEXTAUTH_SECRET: process.env.CLIENT_SECRET, // "secret"
        NEXTAUTH_URL: process.env.CLIENT_APP,
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
