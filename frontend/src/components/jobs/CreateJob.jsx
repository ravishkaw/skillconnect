import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useJobs } from "../../hooks";
import { ArrowLeft, Plus, X } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const jobSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(50, "Description must be at least 50 characters")
    .required("Description is required"),
  budget: yup
    .number()
    .positive("Budget must be positive")
    .required("Budget is required"),
  deadline: yup
    .date()
    .min(new Date(), "Deadline must be in the future")
    .required("Deadline is required"),
  requiredSkills: yup
    .array()
    .of(
      yup.object().shape({
        skill: yup.string().required("Skill is required"),
      })
    )
    .min(1, "At least one skill is required"),
});

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob, loading: submitting } = useJobs();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      requiredSkills: [{ skill: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requiredSkills",
  });

  const onSubmit = async (data) => {
    try {
      // Transform skills array to simple string array
      const jobData = {
        ...data,
        requiredSkills: data.requiredSkills
          .map((item) => item.skill)
          .filter((skill) => skill.trim()),
        deadline: new Date(data.deadline).toISOString(),
      };

      const result = await createJob(jobData);
      if (result.success) {
        navigate("/jobs");
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const addSkill = () => {
    append({ skill: "" });
  };

  const removeSkill = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      <Card>
        <Card.Header>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-600">
            Describe your project and find the perfect freelancer for your
            needs.
          </p>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Job Title"
              placeholder="e.g., Build a responsive website for my business"
              {...register("title")}
              error={errors.title?.message}
            />

            <Textarea
              label="Job Description"
              placeholder="Provide a detailed description of your project, requirements, and expectations..."
              rows={8}
              {...register("description")}
              error={errors.description?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Budget ($)"
                type="number"
                placeholder="Enter your budget"
                {...register("budget")}
                error={errors.budget?.message}
              />

              <Input
                label="Deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("deadline")}
                error={errors.deadline?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g., React, Node.js, Python"
                        {...register(`requiredSkills.${index}.skill`)}
                        error={errors.requiredSkills?.[index]?.skill?.message}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      disabled={fields.length === 1}
                      className="flex-shrink-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                className="mt-3 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </Button>

              {errors.requiredSkills && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.requiredSkills.message}
                </p>
              )}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/jobs")}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Post Job
                </Button>
              </div>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default CreateJob;
