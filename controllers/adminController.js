// controllers/adminController.js
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { roles } = require("../utils/constants");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render("manage-users", { users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.redirect("/admin/users");
    }

    const person = await User.findById(id);
    if (!person) {
      return res.redirect("/admin/users");
    }

    res.render("profile", { person });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    // ...
    if (!id || !role) {
      req.flash("error", "ID and role are required.");
      return res.redirect("back");
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid user ID.");
      return res.redirect("back");
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash("error", "Invalid role.");
      return res.redirect("back");
    }

    // Admin cannot remove itself as an admin
    if (req.user.id === id) {
      req.flash("error", "Cannot update own role.");
      return res.redirect("back");
    }

    // Update the user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("back");
    }

    req.flash("success", "User role updated successfully.");
    res.redirect("back");
  } catch (e) {
    console.log(e);
    next(e);
  }
};
