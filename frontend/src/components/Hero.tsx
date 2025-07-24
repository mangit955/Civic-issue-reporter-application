import { ArrowRight, Camera, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 civic-gradient opacity-5"></div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Report Issues,
                <br />
                <span className="text-white bg-clip-text civic-gradient px-2 rounded-lg">
                    Transform
                </span>
                <br />
                Your Community
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Help build safer, cleaner neighborhoods by reporting
                infrastructure issues. From potholes to broken streetlights,
                your voice matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/report-issue">
                <Button
                  size="lg"
                  className="civic-gradient border-0 text-white hover:opacity-90 flex items-center space-x-2 cursor-pointer"
                >
                  <Camera className="h-5 w-5" />
                  <span>Report an Issue</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/all-issues">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <MapPin className="h-5 w-5" />
                <span>View Reports</span>
              </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2,847</div>
                <div className="text-sm text-muted-foreground">
                  Issues Resolved
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15,239</div>
                <div className="text-sm text-muted-foreground">
                  Active Citizens
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">48h</div>
                <div className="text-sm text-muted-foreground">
                  Avg Response
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Image placeholder */}
          <div className="relative animate-slide-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&h=600&fit=crop"
                alt="Infrastructure and community"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>

              {/* Floating cards */}
              <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Issue Reported</span>
                </div>
              </div>

              <div
                className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Community Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
