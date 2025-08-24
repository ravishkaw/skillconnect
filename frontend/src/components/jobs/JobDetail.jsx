import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useJob, useProposals } from "../../hooks";
import {
  Calendar,
  DollarSign,
  Clock,
  User,
  ArrowLeft,
  Send,
  FileText,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const proposalSchema = yup.object().shape({
  proposalText: yup
    .string()
    .min(50, "Proposal must be at least 50 characters")
    .required("Proposal is required"),
  estimatedCost: yup
    .number()
    .positive("Cost must be positive")
    .required("Estimated cost is required"),
  deliveryTime: yup.string().required("Delivery time is required"),
});

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, loading: jobLoading } = useJob(id);
  const {
    proposals,
    loading: proposalsLoading,
    createProposal,
    updateProposalStatus,
  } = useProposals(id);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(proposalSchema),
  });

  const submitProposal = async (data) => {
    setSubmittingProposal(true);
    try {
      const result = await createProposal(data);
      if (result.success) {
        setShowProposalForm(false);
        reset();
      }
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleProposalAction = async (proposalId, status) => {
    await updateProposalStatus(proposalId, status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const getProposalStatusColor = (status) => {
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

  if (jobLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The job you're looking for doesn't exist.
          </p>
          <Link to="/jobs">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isJobOwner = user?._id === job.clientId._id;
  const canApply =
    user?.role === "freelancer" && job.status === "open" && !isJobOwner;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/jobs")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Jobs</span>
        </Button>
      </div>

      {/* Job Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>{job.clientId.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status.replace("_", " ")}
                </span>
              </div>
            </Card.Header>

            <Card.Content>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Description
                  </h3>
                  <div className="prose prose-sm text-gray-700">
                    {job.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Proposal Form */}
          {canApply && (
            <Card className="mt-6">
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">
                  Submit a Proposal
                </h3>
              </Card.Header>
              <Card.Content>
                {!showProposalForm ? (
                  <Button
                    onClick={() => setShowProposalForm(true)}
                    className="flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Submit Proposal</span>
                  </Button>
                ) : (
                  <form
                    onSubmit={handleSubmit(submitProposal)}
                    className="space-y-4"
                  >
                    <Textarea
                      label="Proposal"
                      placeholder="Describe how you'll complete this project, your relevant experience, and why you're the best fit..."
                      rows={6}
                      {...register("proposalText")}
                      error={errors.proposalText?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Estimated Cost ($)"
                        type="number"
                        placeholder="Enter your bid amount"
                        {...register("estimatedCost")}
                        error={errors.estimatedCost?.message}
                      />

                      <Input
                        label="Delivery Time"
                        type="text"
                        placeholder="e.g., 2 weeks, 1 month"
                        {...register("deliveryTime")}
                        error={errors.deliveryTime?.message}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        loading={submittingProposal}
                        className="flex items-center space-x-2"
                      >
                        <Send size={16} />
                        <span>Submit Proposal</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowProposalForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Proposals List (for job owner) */}
          {isJobOwner && proposals.length > 0 && (
            <Card className="mt-6">
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">
                  Proposals ({proposals.length})
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {proposal.freelancerId.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Submitted {formatDate(proposal.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProposalStatusColor(
                            proposal.status
                          )}`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {proposal.proposalText}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <DollarSign size={14} className="mr-1" />$
                            {proposal.estimatedCost}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {proposal.deliveryTime}
                          </span>
                        </div>

                        {proposal.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleProposalAction(proposal._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleProposalAction(proposal._id, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Budget
                  </span>
                  <div className="flex items-center text-lg font-semibold text-gray-900">
                    <DollarSign size={18} className="mr-1" />
                    {job.budget}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Deadline
                  </span>
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(job.deadline)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </div>

                {proposals.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Proposals
                    </span>
                    <div className="flex items-center text-sm text-gray-900">
                      <FileText size={16} className="mr-1" />
                      {proposals.length}
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Client Info */}
          <Card className="mt-6">
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">
                About the Client
              </h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {job.clientId.name}
                  </h4>
                  {job.clientId.profile?.companyName && (
                    <p className="text-sm text-gray-600">
                      {job.clientId.profile.companyName}
                    </p>
                  )}
                </div>
                {job.clientId.profile?.location && (
                  <p className="text-sm text-gray-600">
                    {job.clientId.profile.location}
                  </p>
                )}
                {job.clientId.profile?.bio && (
                  <p className="text-sm text-gray-700">
                    {job.clientId.profile.bio}
                  </p>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
