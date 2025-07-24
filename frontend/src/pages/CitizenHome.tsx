import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { BACKEND_URL } from "../config/config";
// import { useAuth } from "../contexts/AuthContext";
interface Issues {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  }
  reportedBy: string;
  reportedAt: string;
  image: string;
  status: string;
}

const CitizenHome = () => {

  // const { user } = useAuth();
  const [searchCity, setSearchCity] = useState("");
  
  const [reportedIssues, setReportedIssues] = useState<Issues[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/all-issues`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await response.json();
        console.log("Fetched Issues:", data);
  
        if (Array.isArray(data.issues)) {
          setReportedIssues(data.issues);
        } else {
          setReportedIssues([]);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchIssues();
  }, []);
  
  if (loading) return <div className="flex justify-center items-center h-screen"></div>;

  const filteredIssues = searchCity 
    ? reportedIssues.filter(issue => 
        issue.location && issue.location.address && issue.location.address.toLowerCase().includes(searchCity.toLowerCase())
      )
    : reportedIssues;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section with Profile Link */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, Citizen!</h1>
            <p className="text-muted-foreground mt-2">Help improve your community by reporting issues</p>
          </div>
          <Link to={`/citizen/profile`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Button>
          </Link>
        </div>

        {/* Search Section */}
        <div className="my-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Search Issues by Location</h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Issues Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Issues
              {searchCity && (
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  in {searchCity}
                </span>
              )}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
            {filteredIssues.map((issue) => (
              <Card key={issue._id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={issue.image || "/placeholder.jpg"}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{issue.location.address}</span>
                      <span className="font-medium text-primary">• {issue.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>Reported by {issue.reportedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{issue.reportedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No issues found for "{searchCity}"</p>
            </div>
          )}
        </div>

        {/* Create Issue Button */}
        <div className="fixed bottom-8 right-8">
          <Link to="/citizen/create-issue">
            <Button 
              size="lg" 
              className="civic-gradient border-0 text-white hover:opacity-90 shadow-lg h-14 px-6 rounded-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              Report New Issue
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CitizenHome;