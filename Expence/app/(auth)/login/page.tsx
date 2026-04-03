"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Wallet } from "lucide-react"
import LoginForm from "@/components/modules/auth/LoginForm"

export default function LoginPage() {
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md glass border-0 shadow-xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/25">
              <Wallet className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Sign in to your FinTrack account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">

          {/* Login Form */}
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
