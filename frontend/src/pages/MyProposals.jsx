import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMyProposals } from "../hooks";
import {
  Calendar,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router";

const MyProposals = () => {
  const { user } = useAuth();
  const { proposals, loading, fetchMyProposals } = useMyProposals();

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <FileText size={16} />;
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
        <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
        <p className="mt-2 text-gray-600">
          Track the status of your job applications and proposals.
        </p>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any proposals yet. Start browsing jobs to
              find opportunities that match your skills.
            </p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal._id}>
              <Card.Content className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposal.jobId.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          proposal.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(proposal.status)}
                        </span>
                        {proposal.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {proposal.proposalText}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        <span>Bid: ${proposal.estimatedCost}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>Delivery: {proposal.deliveryTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>Submitted: {formatDate(proposal.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Client: {proposal.jobId.clientId.name}
                      </div>
                      <Link to={`/jobs/${proposal.jobId._id}`}>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;
