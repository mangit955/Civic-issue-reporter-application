import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import civicIssueLogo from "../assets/civic-issue.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { VITE_BACKEND_URL } from "../config/config.tsx";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [citizenForm, setCitizenForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    department: "",
    adminAccessCode: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [citizenErrors, setCitizenErrors] = useState<Record<string, string>>(
    {}
  );
  const [adminErrors, setAdminErrors] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState("citizen");
  const navigate = useNavigate();

  // Password validation: min 8 chars, uppercase, lowercase, digit, special char
  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Citizen signup handler
  const handleCitizenSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCitizenErrors({});

    if (!validatePassword(citizenForm.password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character."
      );
      return;
    }
    if (citizenForm.password !== citizenForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!citizenForm.agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    if (
      citizenForm.phonenumber.trim().length !== 10 ||
      !/^\d{10}$/.test(citizenForm.phonenumber.trim())
    ) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/v1/citizen/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: citizenForm.fullName,
            email: citizenForm.email,
            password: citizenForm.password,
            phonenumber: citizenForm.phonenumber,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration Successful! You can now sign in.");
        navigate("/signin");
      } else if (data.errors && Array.isArray(data.errors)) {
        const errs: Record<string, string> = {};
        data.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            errs[err.path[0]] = err.message;
          }
        });
        setCitizenErrors(errs);
      } else {
        toast.error(data.message || "Something went wrong! Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  // Admin signup handler
  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrors({});

    if (!validatePassword(adminForm.password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character."
      );
      return;
    }
    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!adminForm.agreeToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    if (
      !adminForm.fullName.trim() ||
      !adminForm.email.trim() ||
      !adminForm.phonenumber.trim() ||
      !adminForm.department.trim() ||
      !adminForm.adminAccessCode.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (
      adminForm.phonenumber.trim().length !== 10 ||
      !/^\d{10}$/.test(adminForm.phonenumber.trim())
    ) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
    if (!/^\d{4,}$/.test(adminForm.adminAccessCode)) {
      toast.error("Admin access code must be at least 4 digits.");
      return;
    }

    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/v1/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: adminForm.fullName,
          email: adminForm.email,
          password: adminForm.password,
          phonenumber: adminForm.phonenumber,
          department: adminForm.department,
          adminAccessCode: Number(adminForm.adminAccessCode.trim()),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Admin Registration Successful! Pending approval.");
        navigate("/signin");
      } else if (data.errors && Array.isArray(data.errors)) {
        const errs: Record<string, string> = {};
        data.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            errs[err.path[0]] = err.message;
          }
        });
        setAdminErrors(errs);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#f0f7f5]" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow">
              <img
                src={civicIssueLogo}
                alt="civicIssueLogo"
                className="w-15 h-15 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#016dd0] to-[#159e52] bg-clip-text text-transparent">
                CivicReport
              </h1>
              <p className="text-sm text-muted-foreground">
                Building Better Communities
              </p>
            </div>
          </Link>
        </div>

        <Card className="rounded-2xl shadow-2xl bg-white border-0">
          <CardHeader>
            <CardTitle>
              <center>Create Account</center>
            </CardTitle>
            <CardDescription>
              Join our community to report issues and help build better cities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-200/80 p-1">
                <TabsTrigger
                  value="citizen"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white opacity-80"
                >
                  Citizen
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white opacity-80"
                >
                  Administrator
                </TabsTrigger>
              </TabsList>

              {/* Citizen Tab Content */}
              <TabsContent value="citizen">
                <AnimatePresence mode="wait">
                  {activeTab === "citizen" && (
                    <motion.div
                      key="citizen-motion"
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{ duration: 0.33, ease: "easeOut" }}
                      className="mt-6"
                    >
                      <form
                        onSubmit={handleCitizenSignUp}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="citizen-fullName">Full Name</Label>
                          <Input
                            id="citizen-fullName"
                            placeholder="John Doe"
                            value={citizenForm.fullName}
                            onChange={(e) =>
                              setCitizenForm({
                                ...citizenForm,
                                fullName: e.target.value,
                              })
                            }
                            required
                          />
                          {citizenErrors.fullName && (
                            <p className="text-red-600 text-sm">
                              {citizenErrors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizen-email">Email</Label>
                          <Input
                            id="citizen-email"
                            type="email"
                            placeholder="citizen@example.com"
                            value={citizenForm.email}
                            onChange={(e) =>
                              setCitizenForm({
                                ...citizenForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                          {citizenErrors.email && (
                            <p className="text-red-600 text-sm">
                              {citizenErrors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizen-phone">Phone Number</Label>
                          <Input
                            id="citizen-phone"
                            type="tel"
                            placeholder="0123456789"
                            value={citizenForm.phonenumber}
                            onChange={(e) =>
                              setCitizenForm({
                                ...citizenForm,
                                phonenumber: e.target.value,
                              })
                            }
                            required
                          />
                          {citizenErrors.phonenumber && (
                            <p className="text-red-600 text-sm">
                              {citizenErrors.phonenumber}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizen-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="citizen-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={citizenForm.password}
                              onChange={(e) =>
                                setCitizenForm({
                                  ...citizenForm,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {citizenErrors.password && (
                            <p className="text-red-600 text-sm">
                              {citizenErrors.password}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizen-confirmPassword">
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="citizen-confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={citizenForm.confirmPassword}
                              onChange={(e) =>
                                setCitizenForm({
                                  ...citizenForm,
                                  confirmPassword: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="citizen-terms"
                            checked={citizenForm.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setCitizenForm({
                                ...citizenForm,
                                agreeToTerms: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="citizen-terms" className="text-sm">
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-primary hover:underline"
                            >
                              Terms and Conditions
                            </Link>
                          </Label>
                          {citizenErrors.agreeToTerms && (
                            <p className="text-red-600 text-sm">
                              {citizenErrors.agreeToTerms}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white font-bold shadow-md hover:opacity-70 transition"
                        >
                          Create Citizen Account
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Admin Tab Content */}

              <TabsContent value="admin">
                <AnimatePresence mode="wait">
                  {activeTab === "admin" && (
                    <motion.div
                      key="admin-motion"
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{ duration: 0.33, ease: "easeOut" }}
                      className="mt-6"
                    >
                      <form onSubmit={handleAdminSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-fullName">Full Name</Label>
                          <Input
                            id="admin-fullName"
                            placeholder="Narendra Modi"
                            value={adminForm.fullName}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                fullName: e.target.value,
                              })
                            }
                            required
                          />
                          {adminErrors.fullName && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Official Email</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@city.gov"
                            value={adminForm.email}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                          {adminErrors.email && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-phone">Phone Number</Label>
                          <Input
                            id="admin-phone"
                            type="tel"
                            placeholder="0123456789"
                            value={adminForm.phonenumber}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                phonenumber: e.target.value,
                              })
                            }
                            required
                          />
                          {adminErrors.phonenumber && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.phonenumber}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-department">Department</Label>
                          <Input
                            id="admin-department"
                            placeholder="Public Works"
                            value={adminForm.department}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                department: e.target.value,
                              })
                            }
                            required
                          />
                          {adminErrors.department && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.department}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-code">Admin Access Code</Label>
                          <Input
                            id="admin-code"
                            type="text"
                            placeholder="Contact your supervisor for the code"
                            value={adminForm.adminAccessCode}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                adminAccessCode: e.target.value,
                              })
                            }
                            required
                          />
                          {adminErrors.adminAccessCode && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.adminAccessCode}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="admin-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={adminForm.password}
                              onChange={(e) =>
                                setAdminForm({
                                  ...adminForm,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {adminErrors.password && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.password}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-confirmPassword">
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="admin-confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={adminForm.confirmPassword}
                              onChange={(e) =>
                                setAdminForm({
                                  ...adminForm,
                                  confirmPassword: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {adminErrors.confirmPassword && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="admin-terms"
                            checked={adminForm.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setAdminForm({
                                ...adminForm,
                                agreeToTerms: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="admin-terms" className="text-sm">
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-primary hover:underline"
                            >
                              Terms and Conditions
                            </Link>
                          </Label>
                          {adminErrors.agreeToTerms && (
                            <p className="text-red-600 text-sm">
                              {adminErrors.agreeToTerms}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white font-bold shadow-md hover:opacity-70 transition"
                        >
                          Create Admin Account
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  ← Back to Home
                </Link>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
