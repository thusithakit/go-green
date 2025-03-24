"use server"

import { signIn, signOut } from "@/auth"

export const login = async (method: string, callbackUrl: string = "/") => {
    console.log(method, callbackUrl);
    if (method === "github") {
        await signIn("github", { redirectTo: callbackUrl })
    } else if (method === "google") {
        await signIn("google", { redirectTo: callbackUrl })
    }
}

export const logout = async () => {
    await signOut({ redirectTo: "/" })
}