import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
} from "lucide-react";
import HeaderAfterAuth from "../components/HeaderAfterAuth";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "../config/config";

interface Issues {
  _id: string;
  title: string;
  description: string;
  issueType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  file?: string;
  status: string;
}

const CitizenProfile = () => {
  const { user, updateUserProfile, token, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [myIssues, setMyIssues] = useState<Issues[]>([]);
  const [loadingMyIssues, setLoadingMyIssues] = useState(true);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
  });

  // Show loading state until AuthContext is ready
  if (isLoading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        fullName: profile.fullName,
        email: profile.email,
        phonenumber: profile.phonenumber,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  // Fetch issues reported by this user
  useEffect(() => {
    if (!token) return;

    const fetchMyIssues = async () => {
      try {
        setLoadingMyIssues(true);

        const response = await fetch(
          `${VITE_BACKEND_URL}/api/v1/citizen/issues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          toast.error("Unauthorized! Please log in again.");
          return;
        }

        if (response.ok && Array.isArray(data.issues)) {
          setMyIssues(data.issues);
        } else {
          console.error("Failed to fetch issues:", data.message);
          toast.error(data.message || "Failed to load issues");
        }
      } catch (error) {
        console.error("Error fetching my issues:", error);
        toast.error("Error loading your issues");
      } finally {
        setLoadingMyIssues(false);
      }
    };

    fetchMyIssues();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Rejected":
        return "bg-red-200/70 text-red-900";
      case "Pending":
        return "bg-yellow-200/70 text-yellow-900";
      case "Resolved":
        return "bg-green-200/70 text-green-900";
      case "In Progress":
        return "bg-blue-200/70 text-blue-900";
      default:
        return "bg-gray-200/70 text-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f8]">
      {/* Navbar */}
      <HeaderAfterAuth />

      <div className="pt-20 container mx-auto my-9 max-w-4xl space-y-6 px-4">
        {/* Profile Header */}
        <Card
          className="bg-white/80 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  "
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg bg-[#bedbff]">
                    {profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-slate-600">
                    Citizen Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your profile and view your reported issues
                  </CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                className="text-slate-500 active:bg-gray-200 focus:bg-gray-200 active:ring-0 focus:ring-0"
                onClick={
                  isEditing ? handleSaveProfile : () => setIsEditing(true)
                }
              >
                <Edit className="h-4 w-4  text-purple-700" />
                <div className="hidden sm:block">
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </div>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600 hover:text-blue-800  transition duration-300" />
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">{profile.fullName}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600 hover:text-blue-800  transition duration-300" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">{profile.email}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600 hover:text-blue-800  transition duration-300" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phonenumber}
                      onChange={(e) =>
                        setProfile({ ...profile, phonenumber: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">{profile.phonenumber}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className="bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  hover:scale-[1.02] transition-transform
 "
          >
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{myIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Total Issues Reported
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  hover:scale-[1.02] transition-transform
  "
          >
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {myIssues.filter((issue) => issue.status === "Resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card
            className="bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  hover:scale-[1.02] transition-transform
"
          >
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {
                  myIssues.filter((issue) => issue.status === "In Progress")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card
            className="bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  hover:scale-[1.02] transition-transform
  "
          >
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">
                {myIssues.filter((issue) => issue.status === "Pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Reported Issues */}
        <Card
          className="bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  hover:shadow-xl transition-shadow duration-300 
  "
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-700">
              <FileText className="h-5 w-5 text-indigo-500 hover:text-indigo-700  transition duration-300" />
              <span>My Reported Issues</span>
            </CardTitle>
            <CardDescription>
              Track the status of all issues you've reported
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMyIssues ? (
              <div className="text-center py-6 text-muted-foreground">
                Loading your issues...
              </div>
            ) : myIssues.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                You haven’t reported any issues yet.
              </div>
            ) : (
              <div className="space-y-4">
                {myIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className="border rounded-lg p-4 space-y-3 shadow-sm bg-yellow-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {issue.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </div>

                    {issue.file && (
                      <img
                        src={issue.file}
                        alt="Issue"
                        className="w-full h-40 object-cover rounded-md"
                      />
                    )}

                    <Separator />

                    <div className="grid grid-cols-1  gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{issue.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span>
                          Reported:{" "}
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span>Type: {issue.issueType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenProfile;
