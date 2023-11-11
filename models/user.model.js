const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { roles } = require('../utils/constants');

const validateMaxKecamatanRoles = async function (value, model) {
  try {
    const count = await model.countDocuments({ role: roles.kecamatan });
    return count < 30;
  } catch (error) {
    throw new Error('Error validating max kecamatan roles: ' + error.message);
  }
};


const addressSchema = new mongoose.Schema({
  kecamatan: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validateMaxKecamatanRoles(value, User),
      message: 'Maximal roles kecamatan reached (30)',
    },
  },
  kelurahan: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(roles),
    required: true,
  },
  address: {
    type: addressSchema,
    required: function () {
      return this.role === roles.kecamatan;
    },
    validate: {
      validator: function () {
        if (this.role === roles.kecamatan) {
          return validateMaxKecamatanRoles(this.address.kecamatan, User);
        }
        return true; // Return true jika bukan role kecamatan
      },
      message: 'Maximal roles kecamatan reached (30)',
    },
  },
  kota: {
    type: String,
    required: function () {
      return this.role === roles.admin;
    },
  },
  bagian: {
    type: String,
    required: function () {
      return this.role === roles.petugas;
    },
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;

      // Determine the user's role
      if (this.email === process.env.ADMIN_EMAIL.toLowerCase() && Object.values(roles).includes(roles.admin)) {
        this.role = roles.admin;
      }      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    return next();
  }
});

// Validate the password
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;