const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQxNTczMywiZXhwIjoxNzgxMDIwNTMzfQ.6HAGb-1Hwlp0PJ3JdPMS1YFvKCAMipAQ_4Yitz-DAEk";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function runTest(title, testFn) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TEST: ${title}`);
  console.log(`${"=".repeat(60)}`);

  try {
    await testFn();
    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

async function main() {
  // 1. View All Users
  await runTest("GET ALL USERS", async () => {
    const res = await api.get("/users");

    console.log("Status:", res.status);
    console.log("User Count:", res.data.count);
  });

  // 2. Create Regular User
  await runTest("CREATE REGULAR USER", async () => {
    const res = await api.post("/users", {
      name: "Regular User Twenty Char Name",
      email: "user@example.com",
      address: "123 User Street, City",
      password: "Password@123",
      role: "user",
    });

    console.log(res.data);
  });

  // 3. Create Owner User
  await runTest("CREATE OWNER USER", async () => {
    const res = await api.post("/users", {
      name: "Owner User Twenty Character Name",
      email: "owner@example.com",
      address: "456 Owner Avenue",
      password: "Password@123",
      role: "owner",
    });

    console.log(res.data);
  });

  // 4. Create Another Admin
  await runTest("CREATE ADMIN USER", async () => {
    const res = await api.post("/users", {
      name: "Second Admin Twenty Char Name",
      email: "admin2@example.com",
      address: "789 Admin Blvd",
      password: "Password@123",
      role: "admin",
    });

    console.log(res.data);
  });

  // 5. Invalid Name Validation
  await runTest("INVALID NAME VALIDATION", async () => {
    await api.post("/users", {
      name: "Short Name",
      email: "short@example.com",
      password: "Password@123",
      role: "user",
    });
  });

  // 6. Invalid Password Validation
  await runTest("INVALID PASSWORD VALIDATION", async () => {
    await api.post("/users", {
      name: "Valid Name Twenty Characters",
      email: "passwordtest@example.com",
      password: "password@123",
      role: "user",
    });
  });

  // 7. Duplicate Email Validation
  await runTest("DUPLICATE EMAIL VALIDATION", async () => {
    await api.post("/users", {
      name: "Another User Twenty Char Name",
      email: "user@example.com",
      password: "Password@123",
      role: "user",
    });
  });

  // 8. Final User List
  await runTest("FINAL USER LIST", async () => {
    const res = await api.get("/users");

    console.table(
      res.data.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      }))
    );
  });

  console.log("\n🎉 ADMIN USER MANAGEMENT TESTS COMPLETED");
}

main();