import { BarChart3, Camera, MapPin, Shield, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Features = () => {
  const features = [
    {
      icon: Camera,
      title: "Photo Documentation",
      description:
        "Capture and upload high-quality images of infrastructure issues with automatic metadata tagging.",
      color: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "GPS Location Tracking",
      description:
        "Precise location capture using GPS coordinates ensures accurate issue positioning and faster response.",
      color: "text-green-600",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Connect with neighbors, track issue status, and see the impact of your reports on the community.",
      color: "text-purple-600",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Get instant notifications about your reported issues and track resolution progress in real-time.",
      color: "text-orange-600",
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description:
        "Comprehensive administrative tools for managing reports, assigning tasks, and monitoring city-wide issues.",
      color: "text-red-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Data-driven insights help administrators prioritize resources and track community improvement trends.",
      color: "text-indigo-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Better Communities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to report, track, and resolve civic issues
            efficiently and effectively.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
            >
              <Card
                className=" backdrop-blur-md 
  bg-white/70 
  border border-white/20 
  shadow-lg 
  rounded-xl 
  p-6 
  ring-1 ring-white/10 
  transition-transform 
  hover:scale-[1.02]
] 
   "
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
