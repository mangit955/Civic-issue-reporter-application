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
import { useAuth } from "../contexts/AuthContext.tsx";
import { motion, AnimatePresence } from "framer-motion";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [citizenForm, setCitizenForm] = useState({
    email: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    adminAccessCode: "",
  });
  const [activeTab, setActiveTab] = useState("citizen");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCitizenSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(
        citizenForm.email,
        citizenForm.password,
        "citizen"
      );
      if (result === true) {
        toast("Sign In Successful!", { description: "Welcome back !" });
        navigate("/citizen");
      } else {
        toast.error("Sign In Failed!", { description: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign In Failed!", { description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(
        adminForm.email,
        adminForm.password,
        "admin",
        adminForm.adminAccessCode
      );
      if (result === true) {
        toast("Admin Sign In Successful!", {
          description: "Welcome back, administrator!",
        });
        navigate("/admin");
      } else {
        toast.error("Admin Sign In Failed!", {
          description: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Admin Sign In Failed!", {
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#f0f7f5]" />

      <div className="w-full max-w-md">
        {/* Logo and Title */}

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

        {/* Card with glass effect */}

        <Card className="rounded-2xl shadow-2xl bg-white  border-0">
          <CardHeader>
            <CardTitle>
              <center>Sign In</center>
            </CardTitle>
            <CardDescription>
              Access your account to report issues or manage community reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full "
            >
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="citizen"
                  className=" rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white opacity-80"
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

              <AnimatePresence initial={false}>
                {activeTab === "citizen" && (
                  <TabsContent value="citizen" key="citizen">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form
                        onSubmit={handleCitizenSignIn}
                        className="space-y-4"
                      >
                        <div className="space-y-2 ">
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
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citizen-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="citizen-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
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
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white font-bold shadow-md hover:opacity-90 transition"
                          disabled={loading}
                        >
                          Sign In as Citizen
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === "admin" && (
                  <TabsContent value="admin" key="admin">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleAdminSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Email</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@example.com"
                            value={adminForm.email}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="admin-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
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
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-code">Admin Code</Label>
                          <Input
                            id="admin-code"
                            type="text"
                            placeholder="Enter admin access code"
                            value={adminForm.adminAccessCode}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                adminAccessCode: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white font-bold shadow-md hover:opacity-90 transition"
                          disabled={loading}
                        >
                          Sign In as Administrator
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>

              {/* Links below the forms */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don{"'"}t have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up here
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

export default SignIn;
