import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import axios from "axios"
import { URL } from "./constants"
import { useNavigate } from "react-router-dom"

const OTPInputForm = () => {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      pin: "",
    },
  })
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [isRegenerateActive, setIsRegenerateActive] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(timer)
          setIsRegenerateActive(true)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const handleSubmit = async (pin) => {
    try {
      const { data } = await axios.post(`${URL}/otp`, {
        id: localStorage.getItem("otp-id"),
        otp: pin.pin,
      })

      localStorage.setItem("token", data.token)
      localStorage.removeItem("otp-id")
      // Expiration set to after 10 minutes from now
      localStorage.setItem("expiration", String(Date.now() + 600000))

      navigate("/app")
    } catch (error) {
      console.log("Error while generating OTP", error)
      toast.error("OTP Regenrated Failed.")
    }
  }

  const regenerateOtp = async () => {
    try {
      const { data } = await axios.get(`${URL}/otp`)
      localStorage.setItem("otp-id", data.id)
      setTimeLeft(120)
      setIsRegenerateActive(false)
      toast("OTP Regenrated Successfully.")
    } catch (error) {
      console.log("Error while generating OTP", error)
      toast.error("OTP Regenrated Failed.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Enter verification code
              </h1>
              <p className="text-sm text-muted-foreground">
                Please enter the verification code sent to your mail.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => handleSubmit(data))}
                className="space-y-6 w-full"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your phone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" flex items-center justify-between">
                  {
                    <Button
                      disabled={!isRegenerateActive}
                      onClick={regenerateOtp}
                      variant={"link"}
                    >
                      Regenerate OTP
                    </Button>
                  }
                  <div className="text-sm text-muted-foreground text-center flex items-center mt-0">
                    Time remaining: {formatTime(timeLeft)}
                  </div>
                </div>
                <Button type="submit" className={`w-full`}>
                  Verify
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OTPInputForm
