import { Link } from "react-router-dom"
import { Button } from "./ui/button.tsx";
import { LogIn, LogOut, Shield, User } from "lucide-react";
import civicIssueLogo from "../assets/civic-issue.png";
import { useAuth } from "../contexts/AuthContext.tsx";
import { handleSupportClick } from "./SupportModel.tsx";


const Header = () => {

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

            <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-17 h-17 rounded-lg">
                <img src={civicIssueLogo} alt="civicIssueLogo" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">CivicIssueReporter</h1>
                    <p className="text-xs text-muted-foreground">
                        Building Better Communities
                    </p>
                </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
                <a href="#features" className="text-foreground hover:text-primary transition-colors">
                    Features
                </a>
                <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How It Works
                </a>
                <a href="#contact" onClick={handleSupportClick} className="text-foreground hover:text-primary transition-colors">
                Contact
                </a>
            </nav>

            <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Welcome, {user?.fullName ? user.fullName.split(" ")[0] : "Guest"}!
                </span>
                <Link to={user.role === 'citizen' ? '/citizen' : '/admin'}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="flex items-center space-x-2 civic-gradient border-0 text-white hover:opacity-90">
                    <Shield className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
