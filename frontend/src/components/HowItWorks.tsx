import { Card, CardContent } from "./ui/card";
import { Camera, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: "Capture the Issue",
      description:
        "Take a clear photo of the infrastructure problem using your mobile device or camera.",
      color: "bg-blue-500",
    },
    {
      icon: MapPin,
      title: "Add Location Details",
      description:
        "GPS automatically captures the exact location, or manually adjust for precision.",
      color: "bg-green-500",
    },
    {
      icon: Send,
      title: "Submit Your Report",
      description:
        "Add a brief description and submit your report to the appropriate authorities.",
      color: "bg-purple-500",
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description:
        "Monitor the status of your report and receive updates when action is taken.",
      color: "bg-orange-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reporting civic issues is simple and straightforward. Follow these
            four easy steps to make a difference.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
              >
                <Card className="group  backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white/70 shadow-lg   ">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
