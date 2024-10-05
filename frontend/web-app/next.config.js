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
        NEXTAUTH_SECRET: "secret", //process.env.NEXTAUTH_SECRET, //Need to make this acces from the .env file later
        NEXTAUTH_URL: "http://localhost:3000", // process.env.NEXTAUTH_URL,
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
