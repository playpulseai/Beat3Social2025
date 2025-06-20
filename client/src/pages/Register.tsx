import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from "lucide-react";

const Register: React.FC = () => {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "",
    workEmail: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.role) {
      setError("Please select your role");
      return;
    }

    // Validate work email for teachers and educators
    if ((formData.role === "teacher" || formData.role === "educator") && !formData.workEmail) {
      setError("Work email is required for teachers and educators");
      return;
    }

    // Check if work email is not a common provider (for verification purposes)
    if (formData.workEmail) {
      const commonProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
      const emailDomain = formData.workEmail.split("@")[1]?.toLowerCase();
      if (commonProviders.includes(emailDomain)) {
        setError("Please use your institutional email address for verification");
        return;
      }
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role,
        formData.workEmail || undefined
      );
      
      toast({
        title: "Account created successfully!",
        description: formData.role === "parent" 
          ? "Welcome to Deep3 Social! You can start using the platform immediately."
          : "Your account has been created. It will be reviewed for verification within 24 hours.",
      });
      
      setLocation("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      workEmail: value === "parent" ? "" : prev.workEmail,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Deep3 Social
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
            B3 Platform
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Join our community
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Connect with educators and explore AI in education
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="displayName">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="educator">Educator</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.role === "teacher" || formData.role === "educator") && (
                <div>
                  <Label htmlFor="workEmail">
                    Work Email *
                    <span className="text-xs text-gray-500 ml-1">
                      (Required for verification)
                    </span>
                  </Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="workEmail"
                      name="workEmail"
                      type="email"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="your.name@school.edu"
                      required={formData.role === "teacher" || formData.role === "educator"}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use your institutional email for faster verification
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Choose a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login">
                  <a className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Sign in here
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Notice */}
        {(formData.role === "teacher" || formData.role === "educator") && (
          <div className="text-center">
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Verification Process:</strong> Teacher and educator accounts require verification. 
                You'll receive an email once your account is approved (usually within 24 hours).
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Platform Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Deep3 Social (B3) - AI & Education Platform
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Connecting educators, students, and parents through technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
