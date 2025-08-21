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
import { VITE_BACKEND_URL } from "../config/config";
import Player from "lottie-react";
import emptyAnimation from "../assets/animations/empty.json";
import HeaderAfterAuth from "../components/HeaderAfterAuth";
import starloader from "../assets/animations/starloder.json";
import { motion } from "framer-motion";
import { useLoader } from "../contexts/LoaderContext";

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

const MIN_LOADER_DURATION = 2500; // Minimum loader display time (ms)

const CitizenHome = () => {
  const [searchCity, setSearchCity] = useState("");
  const [reportedIssues, setReportedIssues] = useState<Issues[]>([]);
  const [loading, setLoading] = useState(true);
  const { hideLoader } = useLoader();

  useEffect(() => {
    const fetchIssues = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/v1/all-issues`, {
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
        const elapsed = Date.now() - startTime;
        const delay = Math.max(MIN_LOADER_DURATION - elapsed, 0);

        setTimeout(() => {
          setLoading(false);
          hideLoader();
        }, delay);
      }
    };

    fetchIssues();
  }, [hideLoader]);

  const filteredIssues = searchCity
    ? reportedIssues.filter((issue) =>
        issue.location?.address.toLowerCase().includes(searchCity.toLowerCase())
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <Player
          autoplay
          loop
          animationData={starloader}
          style={{ height: "200px", width: "200px" }}
        />
        <p className="text-muted-foreground mt-4">Fetching issues...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#f3f6f8]"
    >
      <div className="min-h-screen bg-[#f3f6f8]">
        <HeaderAfterAuth />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#0577b7] tracking-wide">
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
                <User className="h-4 w-4 text-purple-700" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-600 mb-4">
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
                className="pl-10 bg-white/70 backdrop-blur-md border border-gray-200 rounded-full placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-sky-600">
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
                  className={`rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all ${
                    issue.status === "Rejected"
                      ? "opacity-30 grayscale"
                      : "opacity-100"
                  }`}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={issue.image || "/placeholder.jpg"}
                      alt={issue.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
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
              </motion.div>
            )}
          </div>

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
    </motion.div>
  );
};

export default CitizenHome;
