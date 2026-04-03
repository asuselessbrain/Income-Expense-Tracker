"use server"

import { cookies } from "next/headers"

export const createUser = async (payload: { name: string, email: string, password: string }) => {
    const { name, email, password } = payload
    const cookieStore = await cookies()

    const res = await fetch(`${process.env.NEXT_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })

    const result = await res.json()

    if(result.success) {
        cookieStore.set("auth_token", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
    }
    return result
}

export const loginUser = async (payload: { email: string, password: string }) => {
    const { email, password } = payload

    const cookieStore = await cookies()

    const res = await fetch(`${process.env.NEXT_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    const result = await res.json()
    
    if(result.success) {
        cookieStore.set("auth_token", result.data, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
    }
    return result
}

export const getCurrentUser = async () => {
    const cookieStore = await cookies()

    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        return null
    }

    return token
}