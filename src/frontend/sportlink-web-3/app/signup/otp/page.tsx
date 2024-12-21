"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/ui-custom/otp-input"
import { authService } from "@/lib/services/api"
import { useToast } from "@/hooks/use-toast"

export default function OTPVerificationPage() {
  const [otp, setOTP] = useState<string[]>(Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const userId = searchParams.get("id")

  const handleVerify = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found",
      })
      return
    }

    setIsLoading(true)
    try {
      const otpCode = otp.join("")
      const response = await authService.verify(parseInt(userId), otpCode, { code: otpCode })
      
      if (response.ok && response.status === 200) {
        toast({
          title: "Success",
          description: "Your account has been verified",
        })
        router.push("/login")
      } else {
        throw new Error("Verification failed")
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error?.message || "Please check your OTP and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!userId) return
    
    try {
      const response = await authService.resendOTP(parseInt(userId), { userId: parseInt(userId) })
      
      if (response.ok && response.status === 200) {
        toast({
          title: "Success",
          description: "Verification code sent",
        })
      } else {
        throw new Error("Failed to resend OTP")
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      toast({
        variant: "destructive",
        title: "Failed to resend OTP",
        description: error?.message || "Please try again later",
      })
    }
  }

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OTPInput
          length={6}
          value={otp}
          onChange={setOTP}
          disabled={isLoading}
        />
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isLoading || otp.some(digit => !digit)}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}