import { useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Checkbox } from "../components/ui/checkbox.tsx";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import civicIssueLogo from "../assets/civic-issue.png";
import { BACKEND_URL } from "../config/config.tsx";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [citizenForm, setCitizenForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    department: "",
    adminAccessCode: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const navigate = useNavigate();

  const handleCitizenSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (citizenForm.password !== citizenForm.confirmPassword) {
        toast("Password Mismatch",{
        description: "Passwords do not match. Please try again.",
      });
      return;
    }
    if (!citizenForm.agreeToTerms) {
      toast("Terms Required",{
        description: "Please agree to the terms and conditions.",
      });
      return;
    }
    // Registration logic
    const response = await fetch(`${BACKEND_URL}/api/v1/citizen/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: citizenForm.fullName,
        email: citizenForm.email,
        password: citizenForm.password,
        phonenumber: citizenForm.phonenumber
      }),
    });

    if(response.ok){
      const result = await response.json();
      console.log(result);

      toast("Registration Successful",{
        description: "Welcome to CivicReport! You can now sign in."
      });
      
      navigate("/signin");
    }
    else {
      toast("Something went wrong!",{
        description: "Please try again"
      });
    }
  };

  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
   if(!adminForm.fullName.trim() ||
   !adminForm.email.trim() ||
   !adminForm.phonenumber.trim() ||
   !adminForm.department.trim() ||
   !adminForm.password ||
   !adminForm.adminAccessCode.trim()) {
  toast.error("Please fill all required fields.");
  return;
}
    if(adminForm.password !== adminForm.confirmPassword) {
  toast.error("Passwords do not match.");
  return;
    }
    if (!/^\d{4,}$/.test(adminForm.adminAccessCode)) {
      toast.error("Admin access code must be at least 4 digits.");
      return;
    }

    if (!adminForm.agreeToTerms) {
    toast("Terms Required",{
        description: "Please agree to the terms and conditions.",
      });
      return;
    }
    if(adminForm.phonenumber.trim().length !== 10 || !/^\d{10}$/.test(adminForm.phonenumber.trim())) {
  toast.error("Phone number must be exactly 10 digits.");
  return;
}

    // Registration logic
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: adminForm.fullName,
        email: adminForm.email,
        password: adminForm.password,
        phonenumber: adminForm.phonenumber,
        department: adminForm.department,
        adminAccessCode: Number(adminForm.adminAccessCode.trim()),
      }),
    });
    if (response.ok) {
   await response.json();
  toast.success("Admin Registration Successful", {
    description: "Your admin account is pending approval."
  });
  navigate("/signin");
} else {
  const errorData = await response.json();
  console.log("Signup error details:", errorData);
  toast.error(
    errorData.errors
      ? errorData.errors.map((e: any) => e.message).join(", ")
      : errorData.message || "Signup failed"
  );
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
            <CardTitle><center>Create Account</center></CardTitle>
            <CardDescription>
              Join our community to report issues and help build better cities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="admin">Administrator</TabsTrigger>
              </TabsList>

              <TabsContent value="citizen">
                <form onSubmit={handleCitizenSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="citizen-firstName">Full Name</Label>
                    <Input
                      id="citizen-firstName"
                      placeholder="Narendra Modi"
                      value={citizenForm.fullName}
                      onChange={(e) => setCitizenForm({...citizenForm, fullName: e.target.value})}
                      required
                    />
                  </div>
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
                    <Label htmlFor="citizen-phone">Phone Number</Label>
                    <Input
                      id="citizen-phone"
                      type="tel"
                      placeholder="0123456789"
                      value={citizenForm.phonenumber}
                      onChange={(e) => setCitizenForm({...citizenForm, phonenumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="citizen-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="citizen-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={citizenForm.confirmPassword}
                        onChange={(e) => setCitizenForm({...citizenForm, confirmPassword: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="citizen-terms"
                      checked={citizenForm.agreeToTerms}
                      onCheckedChange={(checked) => setCitizenForm({...citizenForm, agreeToTerms: checked as boolean})}
                    />
                    <Label htmlFor="citizen-terms" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                  <Button type="submit" className="w-full civic-gradient border-0 text-white">
                    Create Citizen Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-firstName">Full Name</Label>
                    <Input
                      id="admin-firstName"
                      placeholder="Narendra Modi"
                      value={adminForm.fullName}
                      onChange={(e) => setAdminForm({...adminForm, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Official Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@city.gov"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Phone Number</Label>
                    <Input
                      id="admin-phone"
                      type="tel"
                      placeholder="0123456789"
                      value={adminForm.phonenumber}
                      onChange={(e) => setAdminForm({...adminForm, phonenumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-department">Department</Label>
                    <Input
                      id="admin-department"
                      placeholder="Public Works"
                      value={adminForm.department}
                      onChange={(e) => setAdminForm({...adminForm, department: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-code">Admin Access Code</Label>
                    <Input
                      id="admin-code"
                      type="text"
                      placeholder="Contact your supervisor for the code"
                      value={adminForm.adminAccessCode}
                      onChange={(e) => setAdminForm({...adminForm, adminAccessCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={adminForm.confirmPassword}
                        onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="admin-terms"
                      checked={adminForm.agreeToTerms}
                      onCheckedChange={(checked) => setAdminForm({...adminForm, agreeToTerms: checked as boolean})}
                    />
                    <Label htmlFor="admin-terms" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                  <Button type="submit" className="w-full civic-gradient border-0 text-white">
                    Create Admin Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in here
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

export default SignUp;






// jhon@hmail.com
// Trial@12$

// 354354
