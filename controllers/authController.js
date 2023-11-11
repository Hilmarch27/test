const passport = require("passport");
const User = require("../models/user.model");

exports.renderLoginPage = (req, res) => {
  res.render("login");
};

exports.renderRegisterPage = (req, res) => {
  res.render("register");
};

// controllers/authController.js
exports.processLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (!user) {
      req.flash('error', info.message || 'Authentication failed.');
      return res.redirect('/auth/login');
    }

    try {
      if (user.role === 'ADMIN') {
        res.redirect('/admin/users');
      } else if (user.role === 'KECAMATAN') {
        res.redirect('/user/kecamatan');
      } else if (user.role === 'PETUGAS') {
        res.redirect('/petugas/users');
      } else {
        res.redirect('/user/profile');
      }

      console.log('User role:', user.role);
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};




exports.processRegistration = async (req, res, next) => {
  try {
    const { email, password, role, kecamatan, kelurahan, kota, bagian } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'User with this email already exists.');
      return res.redirect("/auth/register");
    }

    // Create a new user and save to the database
    const newUser = new User({ email, password, role });

    // Check role and assign corresponding address fields
    if (role === 'KECAMATAN') {
      newUser.address = { kecamatan, kelurahan };
    } else if (role === 'ADMIN') {
      newUser.kota = kota;
    } else if (role === 'PETUGAS') {
      newUser.bagian = bagian;
    }

    await newUser.save();

    req.flash('success', 'Registration successful. You can now log in.');
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};


exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};
