import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Edit,
  Search,
  Trash2,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { VITE_BACKEND_URL } from "../config/config";
import HeaderAfterAuth from "../components/HeaderAfterAuth";
import { motion } from "framer-motion";
import Player from "lottie-react";
import starloader from "../assets/animations/starloder.json";
import { useLoader } from "../contexts/LoaderContext";

interface Issues {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  reportedBy: string;
  reportedAt: string;
  image: string;
  status: string;
}

const AdminHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issues[]>([]);
  const { hideLoader } = useLoader();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/v1/all-issues`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data.issues)) {
          setIssues(data.issues);
        } else {
          setIssues([]);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
        setIssues([]);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchIssues();
  }, [hideLoader]);

  const handleStatusUpdate = async (issueId: string, status: string) => {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/v1/admin/issue/${issueId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIssues((prev) =>
          prev.map((i) => (i._id === issueId ? { ...i, status } : i))
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/v1/issue/admin/${issueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIssues((prev) => prev.filter((i) => i._id !== issueId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof typeof a] as string;
    const bValue = b[sortColumn as keyof typeof b] as string;
    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const filteredIssues = sortedIssues.filter((issue) => {
    const searchMatch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch =
      statusFilters.length === 0 || statusFilters.includes(issue.status);
    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

        <div className="pt-20 container mx-auto px-4 py-8 space-y-8">
          {/* Welcome Section with Profile Link */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0577b7] ">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and resolve community issues
              </p>
            </div>
            <Link to="/admin/profile">
              <Button
                variant="outline"
                className="flex items-center space-x-2 shadow-sm text-slate-500 "
              >
                <User className="h-4 w-4 text-purple-700" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="p-6 rounded-lg border shadow-lg bg-card  hover:scale-[1.02] transition-transform hover:shadow-xl transition-shadow duration-300  ">
              <div className="text-2xl font-bold text-foreground  ">
                {issues.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Issues</p>
            </div>
            <div className="p-6 rounded-lg border shadow-lg bg-card hover:scale-[1.02] transition-transform hover:shadow-xl transition-shadow duration-300 ">
              <div className="text-2xl font-bold text-green-600">
                {issues.filter((issue) => issue.status === "Resolved").length}
              </div>
              <p className="text-sm text-muted-foreground">Resolved Issues</p>
            </div>
            <div className="p-6 rounded-lg border shadow-lg bg-card hover:scale-[1.02] transition-transform hover:shadow-xl transition-shadow duration-300 ">
              <div className="text-2xl font-bold text-blue-600">
                {
                  issues.filter((issue) => issue.status === "In Progress")
                    .length
                }
              </div>
              <p className="text-sm text-muted-foreground">
                Issues In Progress
              </p>
            </div>
            <div className="p-6 rounded-lg border shadow-lg bg-card hover:scale-[1.02] transition-transform hover:shadow-xl transition-shadow duration-300 ">
              <div className="text-2xl font-bold text-yellow-600">
                {issues.filter((issue) => issue.status === "Pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
            <div className="relative w-full md:w-80 shadow-sm rounded">
              <Search className="absolute  left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 shadow-sm text-slate-600"
                  >
                    Status <ChevronsUpDown className="h-4 w-4 text-gray-500 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("Rejected")}
                    onCheckedChange={(checked) =>
                      setStatusFilters((prev) =>
                        checked
                          ? [...prev, "Rejected"]
                          : prev.filter((s) => s !== "Rejected")
                      )
                    }
                  >
                    Rejected
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("In Progress")}
                    onCheckedChange={(checked) =>
                      setStatusFilters((prev) =>
                        checked
                          ? [...prev, "In Progress"]
                          : prev.filter((s) => s !== "In Progress")
                      )
                    }
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("Resolved")}
                    onCheckedChange={(checked) =>
                      setStatusFilters((prev) =>
                        checked
                          ? [...prev, "Resolved"]
                          : prev.filter((s) => s !== "Resolved")
                      )
                    }
                  >
                    Resolved
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("Pending")}
                    onCheckedChange={(checked) =>
                      setStatusFilters((prev) =>
                        checked
                          ? [...prev, "Pending"]
                          : prev.filter((s) => s !== "Pending")
                      )
                    }
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Issues Table */}
          <div className="rounded-md border bg-white shadow-lg text-slate-500 pl-6 pr-6 hover:shadow-xl transition-shadow duration-300 ">
            <Table>
              <TableCaption>A list of all reported issues.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("title")}
                      className="w-full text-gray-700"
                    >
                      Title
                      {sortColumn === "title" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-gray-500 " />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-gray-500 " />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("location")}
                      className="w-full text-gray-700 "
                    >
                      Location
                      {sortColumn === "location" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-gray-500 " />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-gray-500 " />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="w-full text-gray-700"
                    >
                      Status
                      {sortColumn === "status" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4 text-gray-500 " />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4 text-gray-500 " />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue._id}>
                    <TableCell className="font-medium">{issue.title}</TableCell>
                    <TableCell>{issue.location.address}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <button
                              onClick={() =>
                                handleStatusUpdate(issue._id, "Resolved")
                              }
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              Resolved
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(issue._id, "In Progress")
                              }
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              In Progress
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(issue._id, "Rejected")
                              }
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              Rejected
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(issue._id, "Pending")
                              }
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              Pending
                            </button>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteIssue(issue._id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 " />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredIssues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No issues found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHome;
