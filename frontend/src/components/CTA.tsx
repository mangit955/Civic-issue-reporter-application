import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Users } from "lucide-react";
import { handleSupportClick } from "./SupportModel";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 civic-gradient opacity-95"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of engaged citizens working together to build safer,
            cleaner, and better communities. Your report can spark positive
            change.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                For Citizens
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Report issues, track progress, and engage with your community
              </p>
              <Link to="/citizen">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                For Administrators
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Manage reports, coordinate responses, and track city-wide data
              </p>
              <Link to="/admin">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <span>Admin Access</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 mb-4">
              Questions? Contact our support team
            </p>
            <Button
              variant="outline"
              onClick={handleSupportClick}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Get Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
