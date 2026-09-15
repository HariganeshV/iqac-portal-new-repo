const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function seedAdmin() {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({
      role: "admin"
    });

    if (admin) {

      console.log("Admin already exists.");

      process.exit();

    }

    const password =
      await bcrypt.hash(
        "Admin@123",
        10
      );

    await User.create({

      name: "System Administrator",

      email: "admin@sriher.edu.in",

      password,

      role: "admin",

      gender: "Male",

      school: "IQAC",

      department: "IQAC",

      designation: "System Administrator",

      employeeId: "ADMIN001"

    });

    console.log(
      "Default Admin Created Successfully."
    );

    process.exit();

  }

  catch (error) {

    console.log(error);

    process.exit(1);

  }

}

seedAdmin();