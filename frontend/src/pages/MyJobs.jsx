import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../hooks";
import {
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Briefcase,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router";

const MyJobs = () => {
  const { user } = useAuth();
  const { jobs, loading, fetchJobs, deleteJob } = useJobs();
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs by current user (client)
    const userJobs = jobs.filter((job) => job.clientId._id === user._id);
    setMyJobs(userJobs);
  }, [jobs, user]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const result = await deleteJob(jobId);
      if (result.success) {
        fetchJobs(); // Refresh the list
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="mt-2 text-gray-600">
              Manage your job postings and track applications.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/jobs/create">
              <Button className="flex items-center space-x-2">
                <Plus size={16} />
                <span>Post New Job</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {myJobs.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by posting your first job to find talented freelancers for
              your projects.
            </p>
            <Link to="/jobs/create">
              <Button>Post Your First Job</Button>
            </Link>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </div>
              </Card.Header>

              <Card.Content>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>${job.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Due: {formatDate(job.deadline)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Skills Required:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{job.requiredSkills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </Card.Content>

              <Card.Footer>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText size={16} className="mr-1" />
                    <span>0 proposals</span>{" "}
                    {/* This would come from backend */}
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/jobs/${job._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
