import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import civicIssueLogo from "../assets/civic-issue.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Label } from "../components/ui/label.tsx";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
// import axios from 'axios';
// import { BACKEND_URL } from "@/config/config";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [citizenForm, setCitizenForm] = useState({
    email: "",
    password: ""
  });
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    adminAccessCode: ""
  });
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleCitizenSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(citizenForm.email, citizenForm.password, 'citizen');
      console.log(success)
      if(success) {
        toast("Sign In Successful!",{
          description: "Welcome back, citizen!"
        });
  
        navigate("/citizen");

      } else {
        toast.error("Sign In Failed!",{
          description: "Invalid credentials",
        });
      }

    } catch (error) {
      console.log(error)
      toast.error("Sign In Failed!",{
        description: "Something went wrong",
      });

    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(adminForm.email, adminForm.password, 'admin', adminForm.adminAccessCode);

      if(success) {
        toast("Admin Sign In Successful!",{
          description: "Welcome back, administrator!"
        });
  
        console.log("Login successful, navigating...");
        
        navigate("/admin");
  
        console.log("Success")

      } else {
        toast.error("Admin Sign In Failed!",{
          description: "Invalid credentials",
        });
      }
    } catch (error) {

      console.log(error)
      toast.error("Admin Sign In Failed!",{
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-civic-gradient-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-17 h-17 rounded-lg">
              <img src={civicIssueLogo} alt="civicIssueLogo" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CivicReport</h1>
              <p className="text-sm text-muted-foreground">Building Better Communities</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle><center>Sign In</center></CardTitle>
            <CardDescription>
              Access your account to report issues or manage community reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="admin">Administrator</TabsTrigger>
              </TabsList>

              <TabsContent value="citizen">
                <form onSubmit={handleCitizenSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="citizen-email">Email</Label>
                    <Input
                      id="citizen-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={citizenForm.email}
                      onChange={(e) => setCitizenForm({...citizenForm, email: e.target.value})}
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
                        onChange={(e) => setCitizenForm({...citizenForm, password: e.target.value})}
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
                  <Button type="submit" className="w-full civic-gradient border-0 text-white">
                    Sign In as Citizen
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
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
                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
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
                      onChange={(e) => setAdminForm({...adminForm, adminAccessCode: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full civic-gradient border-0 text-white">
                    Sign In as Administrator
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up here
                </Link>
              </p>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;