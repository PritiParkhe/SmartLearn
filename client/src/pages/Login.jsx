import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authapi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError,
    isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();

  const [loginUser, { data: loginData, error: loginError,
    isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    if (type === "signup") {
      const { name, email, password } = signupInput;
      if (!name || !email || !password) {
        return toast.error("All fields are required.");
      }
      if (password.length < 6) {
        return toast.error("Password must be at least 6 characters.");
      }
      await registerUser(signupInput);
    } else {
      const { email, password } = loginInput;
      if (!email || !password) {
        return toast.error("Email and password are required.");
      }
      await loginUser(loginInput);
    }
  };

  // Register toasts
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
    }
    if (registerError) {
      toast.error(registerError?.data?.message || "Signup failed.");
    }
  }, [registerIsSuccess, registerData, registerError]);

  // Login toasts
  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed.");
    }
  }, [loginIsSuccess, loginData, loginError]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input type="text" name="name" value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Your full name" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="you@example.com" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Min. 6 characters" required /> 
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}>
                {registerIsLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</>
                ) : "Sign Up"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login with your email and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="you@example.com" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Your password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}>
                {loginIsLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</>
                ) : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;