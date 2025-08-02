import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Construction, Trash, TreeDeciduous, Wrench } from "lucide-react";

const IssueTypes = () => {
  const issueTypes = [
    {
      icon: Construction,
      title: "Road Infrastructure",
      description:
        "Report potholes, damaged roads, broken sidewalks, and street maintenance issues.",
      image:
        "https://images.unsplash.com/photo-1547399152-f5bbd6a254b8?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      count: "1,247 reports",
    },
    {
      icon: Trash,
      title: "Waste Management",
      description:
        "Report illegal dumping, overflowing bins, litter, and garbage collection issues.",
      image:
        "https://plus.unsplash.com/premium_photo-1663076452996-abef3ccfc4f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      count: "892 reports",
    },
    {
      icon: TreeDeciduous,
      title: "Environmental Issues",
      description:
        "Report damaged trees, fallen branches, landscaping problems, and green space issues.",
      image:
        "https://plus.unsplash.com/premium_photo-1664298311043-46b3814a511f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D",
      count: "534 reports",
    },
    {
      icon: Wrench,
      title: "Utilities & Infrastructure",
      description:
        "Report water leaks, gas issues, electrical problems, and utility infrastructure concerns.",
      image:
        "https://images.unsplash.com/photo-1591645321243-3adc1e75cfdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGluZnJhc3RydWN0dXJlfGVufDB8fDB8fHww",
      count: "678 reports",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Can You Report?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform covers a wide range of civic issues to help keep your
            community safe and well-maintained.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {issueTypes.map((type, index) => (
            <Card
              key={index}
              className="group  bg-white/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                  <type.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">{type.count}</div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IssueTypes;
