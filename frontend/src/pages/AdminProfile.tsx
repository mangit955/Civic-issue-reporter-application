import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import { Separator } from "../components/ui/separator.tsx";
import { User, Mail, Phone, MapPin, Calendar, FileText, Edit, Shield, CheckCircle } from "lucide-react";
import Header from '../components/Header.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { toast } from 'sonner';
import { BACKEND_URL } from '../config/config.tsx';
import Player from "lottie-react";
import emptyAnimation from "../assets/animations/box.json"; 


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
  const [ respondedIssues, setRespondedIssues ] = useState<Issues[]>([]);
  // const [loading, setLoading] = useState(true);
  const [loadingMyIssues, setLoadingMyIssues] = useState(true);
  // const [myIssues, setMyIssues] = useState<Issues[]>([]);

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

  // const fetchHandledIssues = async () => {
  //   try {
  //     const response = await fetch(`/api/v1/admin/${user.id}/handled-issues`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     });
  //     const data = await response.json();
  //     setRespondedIssues(data.issues);
  //   } catch (error) {
  //     console.error("Error fetching handled issues:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (user?.id) fetchHandledIssues();
  // }, [user?.id]);

    useEffect(() => {
  if (!token || !user?.id) return;

  const fetchMyIssues = async () => {
    setLoadingMyIssues(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/${user.id}/handled-issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
}, [token, user?.id]);

  // const handleStatusChange = async (issueId: string, newStatus: string) => {
  //   try {
  //     await fetch(`/api/v1/admin/issue/${issueId}/status`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  
  //     toast.success("Issue status updated!");
  //     // ✅ Refetch handled issues
  //     // fetchHandledIssues();
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     toast.error("Failed to update status");
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loadingMyIssues) return <p>Loading handled issues...</p>;

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <Header />
      
      <div className="container mx-auto max-w-4xl space-y-6 py-9">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {profile.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl">Administrator Profile</CardTitle>
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardDescription>Manage your profile and view your resolved issues</CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    />
                  ) : (
                    <span>{profile.fullName || "Not Provided"}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  ) : (
                    <span>{profile.email || "Not Provided"}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phonenumber">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="phonenumber"
                      value={profile.phonenumber}
                      onChange={(e) => setProfile({...profile, phonenumber: e.target.value})}
                    />
                  ) : (
                    <span>{profile.phonenumber || "Not assigned"}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                    />
                  ) : (
                    <span>{profile.department || "Not assigned"}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{respondedIssues.length}</div>
              <p className="text-xs text-muted-foreground">Total Issues Handled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {respondedIssues.filter(issue => issue.status === "Resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {respondedIssues.filter(issue => issue.status === "In Progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently Working On</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {respondedIssues.filter(issue => issue.resolvedDate).length > 0 
                  ? Math.round(respondedIssues.filter(issue => issue.resolvedDate).reduce((acc, issue) => {
                      const reportDate = new Date(issue.reportDate);
                      const resolvedDate = new Date(issue.resolvedDate!);
                      return acc + (resolvedDate.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
                    }, 0) / respondedIssues.filter(issue => issue.resolvedDate).length)
                  : 0}d
              </div>
              <p className="text-xs text-muted-foreground">Avg. Resolution Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Responded Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Issues I've Handled</span>
            </CardTitle>
            <CardDescription>Track all issues you've responded to and resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {respondedIssues.length === 0 ? (
  <div className="flex flex-col items-center justify-center mt-10">
    <div className="w-40 h-40">
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
                <div key={issue._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                      <p className="text-sm text-muted-foreground">Reported by: <span className="font-medium">{issue.citizenName}</span></p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-sm"><strong>Your Response:</strong> {issue.adminResponse}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Reported: {issue.reportDate}</span>
                    </div>
                    {issue.resolvedDate && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Resolved: {issue.resolvedDate}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
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


// const respondedIssues = [
//   {
//     id: 1,
//     title: "Broken streetlight on Oak Avenue",
//     description: "The streetlight has been flickering for weeks and now it's completely out.",
//     status: "Resolved",
//     priority: "Medium",
//     location: "Oak Avenue & 2nd Street",
//     reportDate: "2024-01-15",
//     resolvedDate: "2024-01-18",
//     category: "Infrastructure",
//     citizenName: "John Doe",
//     adminResponse: "Streetlight has been repaired and is now functioning properly."
//   },
//   {
//     id: 2,
//     title: "Water main leak on Elm Street",
//     description: "Water bubbling up from the street near residential area.",
//     status: "Resolved",
//     priority: "High",
//     location: "Elm Street & Park Avenue",
//     reportDate: "2024-01-12",
//     resolvedDate: "2024-01-13",
//     category: "Utilities",
//     citizenName: "Mike Wilson",
//     adminResponse: "Emergency repair completed. Water service has been restored."
//   },
//   {
//     id: 3,
//     title: "Traffic signal malfunction",
//     description: "Traffic light stuck on red in all directions causing major delays.",
//     status: "Resolved",
//     priority: "High",
//     location: "Main Street & 1st Avenue",
//     reportDate: "2024-01-08",
//     resolvedDate: "2024-01-09",
//     category: "Traffic",
//     citizenName: "Lisa Chen",
//     adminResponse: "Signal timing has been reset and is operating normally."
//   },
//   {
//     id: 4,
//     title: "Playground equipment damage",
//     description: "Swing set chain broken at Central Park playground.",
//     status: "In Progress",
//     priority: "Medium",
//     location: "Central Park",
//     reportDate: "2024-01-22",
//     resolvedDate: null,
//     category: "Parks & Recreation",
//     citizenName: "David Brown",
//     adminResponse: "Replacement parts have been ordered. Repair scheduled for next week."
//   }
// ];