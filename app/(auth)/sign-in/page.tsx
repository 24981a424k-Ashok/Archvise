"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const { login, user, loading: authLoading } = useAuth()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      router.push('/dashboard')
    } catch (e) {
      // toast notification handled by useAuth
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
          <CardTitle className="text-lg font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-xs">
            Sign in to access your dashboard reports and system designs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary flex items-center">
                  <Lock size={12} className="mr-1.5 text-textMuted" />
                  <span>Password</span>
                </label>
              </div>
              <Input
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                {...register("password")}
                className={errors.password ? "border-danger focus-visible:ring-danger" : ""}
                disabled={loading}
              />
              {errors.password && (
                <span className="text-[10px] font-semibold text-danger">{errors.password.message}</span>
              )}
            </div>

            <Button type="submit" className="w-full font-semibold uppercase tracking-wider text-xs" disabled={loading}>
              {loading ? (
                <span className="flex items-center space-x-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0 border-t border-border mt-4 py-4 text-center">
          <p className="text-[11px] text-textSecondary">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:text-primaryLight hover:underline font-semibold">
              Sign up free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
