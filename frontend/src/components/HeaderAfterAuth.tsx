import { Button } from "./ui/button"
import civicIssueLogo from "../assets/civic-issue.png";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HeaderAfterAuth = () => {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 p-1 rounded-lg civic-gradient">
                <img src={civicIssueLogo} alt="civicIssueLogo" />
              </div>
              {/* Only on citizen home page */}
              <div>
                <h1 className="text-xl font-bold text-foreground">CivicIssueReporter</h1>
                <p className="text-xs text-muted-foreground">Citizen Dashboard</p>
              </div>

              {/* Only on profile pages */}
              <Link to="/citizen">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
            </div>
            
            {/* Not on landing page */}
            <div className="flex items-center space-x-3">
              <Link to="/citizen/profile">
                <Button variant="outline" size="sm">
                    Profile
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                    Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
  )
}

export default HeaderAfterAuth
