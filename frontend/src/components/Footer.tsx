import { MapPin, Mail, Phone, Github, Linkedin, X } from "lucide-react";
import { Button } from "./ui/button";
import civicIssueLogo from "../assets/civic-issue.png";
import { Link } from "react-router-dom";
import { handleSupportClick } from "./SupportModel";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg">
                {/* <MapPin className="h-5 w-5 text-white" /> */}
                <img src={civicIssueLogo} alt="civicIssueLogo" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                CivicIssueRepoter
              </h3>
            </div>
            <p className="text-muted-foreground">
              Empowering communities to report and resolve civic issues through
              technology and civic engagement.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <Link to="/report-issue">
                <li>
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    Report Issue
                  </span>
                </li>
              </Link>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  View Reports
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleSupportClick}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  support@civicreport.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+91 0123456789</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span className="text-muted-foreground">
                  123 Civic Center
                  <br />
                  Community City, CC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 CivicIssueRepoter. All rights reserved. Building better
            communities together.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
