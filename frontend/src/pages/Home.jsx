import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Briefcase,
      title: "Find Quality Jobs",
      description:
        "Browse through thousands of projects and find the perfect match for your skills.",
    },
    {
      icon: Users,
      title: "Connect with Talent",
      description:
        "Access a pool of skilled freelancers ready to bring your projects to life.",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Scale your operations with flexible workforce solutions.",
    },
    {
      icon: CheckCircle,
      title: "Secure Payments",
      description: "Safe and secure payment processing for peace of mind.",
    },
  ];

  const stats = [
    { label: "Active Projects", value: "10K+" },
    { label: "Freelancers", value: "50K+" },
    { label: "Clients", value: "25K+" },
    { label: "Success Rate", value: "98%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connect Skills with
              <span className="block text-yellow-300">Opportunities</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              The premier marketplace where clients find talented freelancers
              and freelancers discover amazing projects.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Get Started
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button size="lg" variant="secondary">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link to="/jobs">
                  <Button size="lg" variant="secondary">
                    <span>Browse Jobs</span>
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in the freelance
              marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Icon size={32} className="text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful freelancers and clients who trust
              SkillConnect for their project needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Join as Freelancer
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-indigo-600"
                >
                  Hire Freelancers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {user?.role === "client"
                ? "Ready to find the perfect freelancer for your next project?"
                : "Discover amazing projects that match your skills."}
            </p>
            <Link to="/jobs">
              <Button size="lg" className="flex items-center space-x-2 mx-auto">
                <span>
                  {user?.role === "client" ? "Post a Job" : "Browse Jobs"}
                </span>
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
