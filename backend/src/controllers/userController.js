const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, bio, skills, companyName, location, avatar, email } =
      req.body;
    const { profile } = user;

    // Only allow updating certain fields
    user.name = name || user.name;
    user.email = email || user.email;
    profile.bio = bio || profile.bio;
    profile.skills = skills || profile.skills;
    profile.companyName = companyName || profile.companyName;
    profile.location = location || profile.location;
    profile.avatar = avatar || profile.avatar;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

module.exports = { getAllUsers, getSingleUser, updateUser };
