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
        NEXTAUTH_SECRET: "secret", // process.env.CLIENT_SECRET, //Need to make this acces from the .env file later
        NEXTAUTH_URL: "https://carsbidi.onrender.com:10000/api/auth/callback/id-server", // process.env.CLIENT_APP,
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
