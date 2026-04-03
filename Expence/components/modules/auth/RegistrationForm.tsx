"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createUser } from "@/services/auth"
import { toast } from "sonner"

export default function RegistrationForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false })

    const passwordStrength = useMemo(() => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }, [password])

    const strengthLabel = useMemo(() => {
        if (passwordStrength === 0) return { label: "", color: "" }
        if (passwordStrength <= 2) return { label: "Weak", color: "bg-rose-500" }
        if (passwordStrength <= 3) return { label: "Fair", color: "bg-amber-500" }
        if (passwordStrength <= 4) return { label: "Good", color: "bg-emerald-500" }
        return { label: "Strong", color: "bg-emerald-600" }
    }, [passwordStrength])

    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!passwordsMatch || passwordStrength < 3) return

        setIsLoading(true)

        const res = await createUser({ name, email, password })

        if (res.success) {
            toast.success(res.message || "Registration successful")
            router.push("/")
        }
        else {
            toast.error(res.errorMessage || "Registration failed")
        }
        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 rounded-xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        required
                        className={cn(
                            "h-11 rounded-xl pr-10",
                            touched.email && !isEmailValid && email && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                    />
                    {touched.email && email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isEmailValid ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <X className="h-4 w-4 text-rose-500" />
                            )}
                        </div>
                    )}
                </div>
                {touched.email && !isEmailValid && email && (
                    <p className="text-xs text-rose-500">Please enter a valid email address</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                        required
                        className="h-11 rounded-xl pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                    <div className="space-y-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                    key={level}
                                    className={cn(
                                        "h-1 flex-1 rounded-full transition-colors",
                                        passwordStrength >= level ? strengthLabel.color : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>
                        <p className={cn(
                            "text-xs",
                            passwordStrength <= 2 ? "text-rose-500" :
                                passwordStrength <= 3 ? "text-amber-500" : "text-emerald-500"
                        )}>
                            {strengthLabel.label}
                            {passwordStrength < 3 && " - Use 8+ chars, uppercase, numbers, symbols"}
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
                        required
                        className={cn(
                            "h-11 rounded-xl pr-10",
                            touched.confirmPassword && !passwordsMatch && confirmPassword && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {touched.confirmPassword && confirmPassword && (
                    <p className={cn("text-xs", passwordsMatch ? "text-emerald-500" : "text-rose-500")}>
                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isLoading || !passwordsMatch || passwordStrength < 3}
                className={cn(
                    "w-full h-11 rounded-xl font-semibold transition-all",
                    "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    "Create account"
                )}
            </Button>
        </form>
    )
}
