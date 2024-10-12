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
        NEXTAUTH_URL: "https://carsbidi.onrender.com",
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
