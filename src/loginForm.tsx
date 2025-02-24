import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import axios from "axios"
import { URL } from "@/constants"
import { useNavigate } from "react-router-dom"

export default function Component() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [vals, setVals] = useState({
    username: "",
    password: "",
  })
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`${URL}/auth/admin`, vals)
      const { data } = await axios.get(`${URL}/otp`)

      console.log({ data })

      localStorage.setItem("otp-id", data.id)

      navigate("/otp")
    } catch (error) {
      setError(
        //@ts-ignore
        error?.response?.data?.message ||
          "Error occurred check console for more details"
      )
      console.log("Error_While_Login", error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={vals.username}
                  onChange={(e) =>
                    setVals({ ...vals, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={vals.password}
                    onChange={(e) =>
                      setVals({ ...vals, password: e.target.value })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        {error && (
          <p className="text-red-500 font-semibold text-center p-5 pt-0">{`Error : ${error}`}</p>
        )}
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!Object.values(vals).every(Boolean)}
            className="w-full"
          >
            Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
