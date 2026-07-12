"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Mail, Lock, Loader2, CheckSquare, Square } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms of service and privacy policy to register"
  })
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, user, loading: authLoading, loginWithGoogle } = useAuth()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', acceptTerms: false }
  })

  const acceptTerms = watch("acceptTerms")

  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true)
    try {
      await signUp(values.email, values.password, values.name)
      router.push('/dashboard')
    } catch (e) {
      // toast error handled by hook
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-center items-center px-4 py-12 select-none relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Brand header */}
      <div className="flex items-center space-x-2.5 mb-8">
        <ArchviseLogo size={32} className="text-primary animate-pulse" />
        <span className="font-extrabold tracking-tight text-xl">Archvise</span>
      </div>

      <Card className="w-full max-w-sm border-border bg-card shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-bold">Create Free Account</CardTitle>
          <CardDescription className="text-xs">
            Start auditing code and designing scalable architectures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex items-center">
                <User size={12} className="mr-1.5 text-textMuted" />
                <span>Full Name</span>
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={errors.name ? "border-danger focus-visible:ring-danger" : ""}
                disabled={loading}
              />
              {errors.name && (
                <span className="text-[10px] font-semibold text-danger">{errors.name.message}</span>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex items-center">
                <Mail size={12} className="mr-1.5 text-textMuted" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={errors.email ? "border-danger focus-visible:ring-danger" : ""}
                disabled={loading}
              />
              {errors.email && (
                <span className="text-[10px] font-semibold text-danger">{errors.email.message}</span>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex items-center">
                <Lock size={12} className="mr-1.5 text-textMuted" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                {...register("password")}
                className={errors.password ? "border-danger focus-visible:ring-danger" : ""}
                disabled={loading}
              />
              {errors.password && (
                <span className="text-[10px] font-semibold text-danger">{errors.password.message}</span>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-1.5">
              <div 
                className="flex items-start space-x-2.5 cursor-pointer text-xs select-none"
                onClick={() => setValue("acceptTerms", !acceptTerms, { shouldValidate: true })}
              >
                <div className="text-primary shrink-0 mt-0.5">
                  {acceptTerms ? <CheckSquare size={16} /> : <Square size={16} className="text-textSecondary" />}
                </div>
                <span className="text-textSecondary leading-normal">
                  I accept the{" "}
                  <Link href="/legal/terms" target="_blank" className="text-primary hover:underline font-semibold" onClick={e => e.stopPropagation()}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" target="_blank" className="text-primary hover:underline font-semibold" onClick={e => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                </span>
              </div>
              {errors.acceptTerms && (
                <span className="text-[10px] font-semibold text-danger block mt-1">{errors.acceptTerms.message}</span>
              )}
            </div>

            <Button type="submit" className="w-full font-semibold uppercase tracking-wider text-xs" disabled={loading}>
              {loading ? (
                <span className="flex items-center space-x-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Registering...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0 border-t border-border mt-4 py-4 text-center">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full text-xs font-bold uppercase tracking-wider h-10 border border-border bg-surface hover:bg-card text-textPrimary flex items-center justify-center space-x-2"
            onClick={loginWithGoogle}
            disabled={loading}
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <p className="text-[11px] text-textSecondary">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:text-primaryLight hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
