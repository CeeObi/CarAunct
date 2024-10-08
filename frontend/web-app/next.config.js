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
        NEXTAUTH_URL: process.env.CLIENT_APP, // "http://localhost:3000"
    },
    reactStrictMode: false,
    async redirects() {
        return [
            {
                source: "/(.*)",
                has: [
                    {
                        type: "host",
                        value: "^(?!localhost).*", // Matches all hosts except localhost
                    },
                ],
                destination: "https://carsbidi.onrender.com/:path*", // Redirect to HTTPS in production
                permanent: true,
            },
            {
                source: "/(.*)",
                has: [
                    {
                        type: "host",
                        value: "localhost", // Matches localhost for development
                    },
                ],
                destination: "https://localhost:3000/:path*", // Redirect to HTTPS for localhost
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
