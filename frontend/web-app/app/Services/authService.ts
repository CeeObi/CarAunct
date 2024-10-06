import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

//get session
export async function getCurrentUser() {
    try {
        const session = await getSession();
        if (!session) return null;
        return session.user;
    } catch (error) {
        return null;
    }
}

//get token
export function getTokenWorkAround() {
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(
            cookies()
                .getAll()
                .map((c) => [c.name, c.value])
        ),
    } as NextApiRequest;

    return getToken({ req });
}

//get session details using nex-auth libraries
export async function getSession() {
    return await getServerSession(authOptions);
}
