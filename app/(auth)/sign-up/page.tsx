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
  const { signUp, user, loading: authLoading, guestLogin } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [guestLoading, setGuestLoading] = React.useState(false)

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleGuestLogin = async () => {
    setGuestLoading(true)
    try {
      await guestLogin()
      router.push('/dashboard')
    } catch (e) {
      // handled
    } finally {
      setGuestLoading(false)
    }
  }

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
            className="w-full text-xs font-bold uppercase tracking-wider h-10 border-dashed border-primary/40 hover:border-primary text-primary"
            onClick={handleGuestLogin}
            disabled={loading || guestLoading}
          >
            {guestLoading ? (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            ) : null}
            <span>Try Guest Access (Free)</span>
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
