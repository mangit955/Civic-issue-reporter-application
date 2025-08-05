import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Badge } from "../components/ui/badge.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar.tsx";
import { Separator } from "../components/ui/separator.tsx";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "../config/config.tsx";
import Player from "lottie-react";
import emptyAnimation from "../assets/animations/box.json";
import HeaderAfterAuth from "../components/HeaderAfterAuth";

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
  status: string;
  priority?: string;
  resolvedDate?: string | null;
  reportDate?: string;
  category?: string;
  citizenName?: string;
  adminResponse?: string;
}

const AdminProfile = () => {
  const { user, updateUserProfile, token, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [respondedIssues, setRespondedIssues] = useState<Issues[]>([]);
  const [loadingMyIssues, setLoadingMyIssues] = useState(true);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
    department: user?.department || "",
  });

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
        department: profile.department,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchMyIssues = async () => {
      setLoadingMyIssues(true);
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/v1/admin/handled-issues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          toast.error("Unauthorized! Please log in again.");
          return;
        }

        const data = await response.json();

        if (response.ok && Array.isArray(data.issues)) {
          setRespondedIssues(data.issues);
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
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (loadingMyIssues) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading handled issues...</p>
      </div>
    );
  }

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
                <Avatar className="h-20 w-20 ">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg bg-[#bedbff] ">
                    {profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl text-slate-600">
                      Administrator Profile
                    </CardTitle>
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardDescription>
                    Manage your profile and view your resolved issues
                  </CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                className="text-slate-500 active:bg-gray-200 focus:bg-gray-200 active:ring-0 focus:ring-0 "
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
                    <span className="text-gray-400">
                      {profile.fullName || "Not Provided"}
                    </span>
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
                    <span className="text-gray-400">
                      {profile.email || "Not Provided"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phonenumber">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600 hover:text-blue-800  transition duration-300" />
                  {isEditing ? (
                    <Input
                      id="phonenumber"
                      value={profile.phonenumber}
                      onChange={(e) =>
                        setProfile({ ...profile, phonenumber: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">
                      {profile.phonenumber || "Not assigned"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-yellow-500 hover:text-yellow-700  transition duration-300" />
                  {isEditing ? (
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) =>
                        setProfile({ ...profile, department: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-gray-400">
                      {profile.department || "Not assigned"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Statistics */}
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
            <CardContent className="p-6 ">
              <div className="text-2xl font-bold">{respondedIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Total Issues Handled
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
                {
                  respondedIssues.filter((issue) => issue.status === "Resolved")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully Resolved
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
              <div className="text-2xl font-bold text-blue-600">
                {
                  respondedIssues.filter(
                    (issue) => issue.status === "In Progress"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Currently Working On
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
              <div className="text-2xl font-bold">
                {respondedIssues.filter((issue) => issue.resolvedDate).length >
                0
                  ? Math.round(
                      respondedIssues
                        .filter((issue) => issue.resolvedDate)
                        .reduce((acc, issue) => {
                          const reportDate = new Date(issue.reportDate ?? "");
                          const resolvedDate = new Date(issue.resolvedDate!);
                          return (
                            acc +
                            (resolvedDate.getTime() - reportDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                        }, 0) /
                        respondedIssues.filter((issue) => issue.resolvedDate)
                          .length
                    )
                  : 0}
                d
              </div>
              <p className="text-xs text-muted-foreground">
                Avg. Resolution Time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Responded Issues */}
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
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 hover:text-green-700  transition duration-300" />
              <span>Issues I've Handled</span>
            </CardTitle>
            <CardDescription>
              Track all issues you've responded to and resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {respondedIssues.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-10 ">
                  <div className="w-40 h-40 ">
                    <Player
                      autoplay
                      loop
                      animationData={emptyAnimation}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <p className="text-center mt-4 text-muted-foreground text-lg font-medium">
                    You haven't handled any issues yet.
                  </p>
                </div>
              ) : (
                respondedIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className="border rounded-lg p-4 space-y-3 shadow-sm bg-blue-50 "
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {issue.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Reported by:{" "}
                          <span className="font-medium">
                            {issue.citizenName}
                          </span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <p className="text-sm">
                        <strong>Your Response:</strong> {issue.adminResponse}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1  gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{issue.location?.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span>
                          Reported:{" "}
                          {issue.reportDate
                            ? new Date(issue.reportDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      {issue.resolvedDate && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Resolved: {issue.resolvedDate}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span>Category: {issue.category}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
