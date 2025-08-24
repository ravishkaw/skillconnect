import { useState, useEffect } from "react";
import { useUserProfile } from "../hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Mail, MapPin, Building2, FileText, Plus, X } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  profile: yup.object().shape({
    bio: yup.string(),
    location: yup.string(),
    companyName: yup.string(),
    skills: yup.array().of(yup.string()),
  }),
});

const Profile = () => {
  const { user, loading, updateProfile } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(user?.profile?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      profile: {
        bio: user?.profile?.bio || "",
        location: user?.profile?.location || "",
        companyName: user?.profile?.companyName || "",
      },
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        profile: {
          bio: user.profile?.bio || "",
          location: user.profile?.location || "",
          companyName: user.profile?.companyName || "",
        },
      });
      setSkills(user.profile?.skills || []);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const profileData = {
        ...data,
        profile: {
          ...data.profile,
          skills,
        },
      };

      const result = await updateProfile(profileData);
      if (result.success) {
        setEditing(false);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and profile information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                {!editing && (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Content>
              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      {...register("name")}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>

                  <Textarea
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    {...register("profile.bio")}
                    error={errors.profile?.bio?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Location"
                      placeholder="City, Country"
                      {...register("profile.location")}
                      error={errors.profile?.location?.message}
                    />
                    {user?.role === "client" && (
                      <Input
                        label="Company Name"
                        placeholder="Your company"
                        {...register("profile.companyName")}
                        error={errors.profile?.companyName?.message}
                      />
                    )}
                  </div>

                  {user?.role === "freelancer" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addSkill())
                            }
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            disabled={!newSkill.trim()}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="text-gray-900">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {user?.profile?.bio && (
                    <div className="flex items-start space-x-3">
                      <FileText size={20} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bio</p>
                        <p className="text-gray-900">{user.profile.bio}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user?.profile?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Location
                          </p>
                          <p className="text-gray-900">
                            {user.profile.location}
                          </p>
                        </div>
                      </div>
                    )}
                    {user?.profile?.companyName && (
                      <div className="flex items-center space-x-3">
                        <Building2 size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Company
                          </p>
                          <p className="text-gray-900">
                            {user.profile.companyName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {user?.role === "freelancer" &&
                    user?.profile?.skills?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">
                Account Info
              </h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Type
                  </p>
                  <p className="text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
