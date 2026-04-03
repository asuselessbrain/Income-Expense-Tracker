"use server"
import { ICategory } from "@/types";
import { cookies } from "next/headers";

export const createCategory = async (data: ICategory) => {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    const res = await fetch(`${process.env.NEXT_URL}/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

export const getCategory = async (type: string) => {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    const res = await fetch(`${process.env.NEXT_URL}/category?type=${type}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
} 