import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks";
import {
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  FolderOpen,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router";

const Projects = () => {
  const { user } = useAuth();
  const { projects, loading, fetchProjects, updateProjectStatus } =
    useProjects();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateProjectStatus = async (projectId, status) => {
    await updateProjectStatus(projectId, status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === "client" ? "My Projects" : "Active Projects"}
        </h1>
        <p className="mt-2 text-gray-600">
          {user?.role === "client"
            ? "Track the progress of your hired projects."
            : "Manage your active freelance projects."}
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === "client"
                ? "You haven't hired any freelancers yet. Start by posting a job and accepting proposals."
                : "You don't have any active projects yet. Apply to jobs to get started."}
            </p>
            <Link to="/jobs">
              <Button>
                {user?.role === "client" ? "Browse Freelancers" : "Browse Jobs"}
              </Button>
            </Link>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-lg transition-shadow"
            >
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.jobId?.title || "Untitled Project"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {user?.role === "client"
                        ? `Freelancer: ${project.freelancerId?.name}`
                        : `Client: ${project.clientId?.name}`}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        project.paymentStatus
                      )}`}
                    >
                      {project.paymentStatus}
                    </span>
                  </div>
                </div>
              </Card.Header>

              <Card.Content>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {project.jobId?.description || "No description available"}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>${project.jobId?.budget || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Started: {formatDate(project.createdAt)}</span>
                  </div>
                  {project.jobId?.deadline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>Due: {formatDate(project.jobId.deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Skills:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.jobId?.requiredSkills
                      ?.slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    {project.jobId?.requiredSkills?.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{project.jobId.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Card.Content>

              <Card.Footer>
                <div className="flex justify-between items-center">
                  <Link to={`/jobs/${project.jobId?._id}`}>
                    <Button variant="outline" size="sm">
                      View Job
                    </Button>
                  </Link>

                  {project.status === "active" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateProjectStatus(project._id, "completed")
                      }
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle size={14} />
                      <span>Complete</span>
                    </Button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
