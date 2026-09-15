const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require(
  "../utils/generateToken"
);

exports.registerUser = async (
  req,
  res
) => {

  try {

    const {
  name,
  email,
  password,
  role,
  school,
  department,
  designation,
  gender,
  employeeId,
  dateOfJoining,
  facultyPhoto,
  employmentType,
  dateOfAppointment,
  dateOfRelieving,
  scopusAuthorId,
  vidwanId
} = req.body;

    // =========================
    // VALIDATIONS
    // =========================

    if (
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full Name is required"
      });
    }

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required"
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Email Format"
      });
    }

    if (
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required"
      });
    }

    if (
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters"
      });
    }

    if (
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role is required"
      });
    }

    if (
      !school
    ) {
      return res.status(400).json({
        success: false,
        message:
          "School is required"
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation is required"
      });
    }

    if (!dateOfJoining) {
      return res.status(400).json({
        success: false,
        message: "Date of Joining is required"
      });
    }

    if (
      role !== "dean" &&
      (
        !department ||
        !department.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Department is required"
      });
    }

    // =========================
    // CHECK USER EXISTS
    // =========================

    if (role === "admin") {
  return res.status(403).json({
    success: false,
    message: "Admin registration is not allowed."
  });
}

    const userExists =
      await User.findOne({
        email
      });

    if (
      userExists
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists"
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // =========================
    // CREATE USER
    // =========================

    const user =
  await User.create({

    name: name.trim(),

    email: email.trim(),

    password: hashedPassword,

    role,

    school,

    department:
      role === "dean"
        ? ""
        : department,

    designation,

    gender,

    employeeId,

    dateOfJoining,

    facultyPhoto: role === "faculty" ? facultyPhoto : "",
    employmentType: role === "faculty" ? employmentType : "",
    dateOfAppointment: role === "faculty" ? dateOfAppointment : "",
    dateOfRelieving: role === "faculty" ? dateOfRelieving : "",
    scopusAuthorId: role === "faculty" ? scopusAuthorId : "",
    vidwanId: role === "faculty" ? vidwanId : ""
});

    res.status(201).json({

      success: true,

      token:
        generateToken(
          user._id
        ),

      user

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

exports.loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    // ============================
    // FIND USER
    // ============================

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ============================
    // ACCOUNT DELETED
    // ============================

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been removed. Please contact the Administrator."
      });
    }

    // ============================
    // ACCOUNT DEACTIVATED
    // ============================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated by the Administrator."
      });
    }

    // ============================
    // PASSWORD CHECK
    // ============================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials"
      });
    }

    // ============================
    // LOGIN SUCCESS
    // ============================

    return res.json({

      success: true,

      token:
        generateToken(
          user._id
        ),

      user

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};
// ==============================
// GET LOGGED-IN USER
// ==============================

exports.getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }

    res.status(200).json({

      success: true,

      user

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};