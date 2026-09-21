require("dotenv").config();
const mongoose = require("mongoose");
const Provider = require("./src/models/provider");

const initProviders = [
  {
    name: "Dr. kansra",
    service: "General Medicine Consultation",
    isActive: true,
  },
  {
    name: "Dr. Rajesh sharma",
    service: "General Medicine Consultation",
    isActive: true,
  },
  {
    name: "Sunita Mehra",
    service: "GST Filing & Tax Planning",
    isActive: true,
  },
  {
    name: "Ananya Roy",
    service: "Ayurvedic Diet & Panchakarma",
    isActive: true,
  },
  {
    name: "Harpreet Singh",
    service: "Modular Carpentry & Repairs",
    isActive: true,
  },
  {
    name: "Deepak Kulkarni",
    service: "JEE Physics Coaching",
    isActive: true,
  },
];

async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected succesfully");

    await Provider.deleteMany({});
    console.log("Existing data cleared");

    const createdProviders = await Provider.insertMany(initProviders);
    console.log(
      ` Successfully initialized ${createdProviders.length} providers:`,
    );
    createdProviders.forEach((p) =>
      console.log(`   - ${p.name} (${p.service}) [ID: ${p._id}]`),
    );
  } catch (err) {
    console.error(" Error initializing database:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log(" Database connection closed");
    process.exit(0);
  }
}

initDatabase();
