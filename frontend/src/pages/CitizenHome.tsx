import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Search, Plus, MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config/config";
import Player from "lottie-react";
import emptyAnimation from "../assets/animations/empty.json";
import HeaderAfterAuth from "../components/HeaderAfterAuth";

interface Issues {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reportedBy: string;
  reportedAt: string;
  image: string;
  status: string;
}

const CitizenHome = () => {
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

  if (loading)
    return <div className="flex justify-center items-center h-screen"></div>;

  const filteredIssues = searchCity
    ? reportedIssues.filter(
        (issue) =>
          issue.location &&
          issue.location.address &&
          issue.location.address
            .toLowerCase()
            .includes(searchCity.toLowerCase())
      )
    : reportedIssues;

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 space-y-10">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#0577b7]   tracking-wide">
              Welcome, Citizen!
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              Help improve your community by reporting issues
            </p>
          </div>
          <Link to={`/citizen/profile`}>
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full shadow-sm hover:shadow-md transition-all text-slate-500"
            >
              <User className="h-4 w-4 text-blue-500" />
              <span>My Profile</span>
            </Button>
          </Link>
        </div>

        {/* Search Section */}
        <div>
          <h2 className="text-2xl font-semibold  text-slate-600 mb-4">
            Search Issues by Location
          </h2>
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-20"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-md border border-gray-200 rounded-full placeholder:text-gray-400  "
            />
          </div>
        </div>

        {/* Issues Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold  text-sky-600">
              Recent Issues
              {searchCity && (
                <span className="text-lg font-normal text-gray-400 ml-2">
                  in {searchCity}
                </span>
              )}
            </h2>
            <div className="text-sm text-gray-400">
              {filteredIssues.length} issue
              {filteredIssues.length !== 1 ? "s" : ""} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[600px] overflow-y-auto">
            {filteredIssues.map((issue) => (
              <Card
                key={issue._id}
                className={`rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] transition-transform ${
                  issue.status === "Rejected"
                    ? "opacity-30 grayscale"
                    : "opacity-100"
                }`}
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={issue.image || "/placeholder.jpg"}
                    alt={issue.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-800">
                    {issue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{issue.location.address}</span>
                      <span className="font-medium text-teal-600">
                        • {issue.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span>Reported by {issue.reportedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{issue.reportedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="max-w-xs mx-auto mb-4">
                <Player
                  autoplay
                  loop
                  animationData={emptyAnimation}
                  style={{ height: "180px", width: "180px" }}
                />
              </div>
              <p className="text-gray-400">
                {searchCity ? (
                  <>
                    No issues found for{" "}
                    <span className="font-semibold">{searchCity}</span>
                  </>
                ) : (
                  "No issues available at the moment."
                )}
              </p>
            </div>
          )}
        </div>

        {/* Create Issue Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link to="/citizen/create-issue">
            <Button
              size="lg"
              className="civic-gradient text-white border-0 h-14 px-6 rounded-full 
                 shadow-lg hover:shadow-2xl hover:scale-105 
                 transition-transform duration-300"
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
