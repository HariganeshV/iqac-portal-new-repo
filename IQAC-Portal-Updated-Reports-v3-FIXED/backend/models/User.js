const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["faculty", "hod", "dean", "admin"],
      required: true
    },

    school: {
      type: String,
      required: true
    },

    department: {
      type: String,
      default: ""
    },

    designation: {
      type: String,
      default: ""
    },

    gender: {
  type: String,
  enum: ["Male", "Female"],
  required: true
},

    employeeId: {
      type: String,
      default: ""
    },

    dateOfJoining: {
      type: String,
      default: ""
    },

    facultyPhoto: {
      type: String,
      default: ""
    },

    employmentType: {
      type: String,
      enum: ["", "Permanent", "Temporary"],
      default: ""
    },

    dateOfAppointment: {
      type: String,
      default: ""
    },

    dateOfRelieving: {
      type: String,
      default: ""
    },

    scopusAuthorId: {
      type: String,
      default: ""
    },

    vidwanId: {
      type: String,
      default: ""
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);