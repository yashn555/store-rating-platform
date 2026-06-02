const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQxNTczMywiZXhwIjoxNzgxMDIwNTMzfQ.6HAGb-1Hwlp0PJ3JdPMS1YFvKCAMipAQ_4Yitz-DAEk";

const OWNER_ID = 3; // Replace with actual owner ID

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function runTest(title, fn) {
  console.log("\n==================================================");
  console.log(`TEST: ${title}`);
  console.log("==================================================");

  try {
    await fn();
    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

async function main() {

  // 1 Create Store
  await runTest("CREATE TECH STORE", async () => {
    const res = await api.post("/stores", {
      name: "Tech Solutions Store",
      email: "contact@techsolutions.com",
      address: "123 Tech Park, Silicon Valley",
      ownerId: OWNER_ID,
    });

    console.log(res.data);
  });

  // 2 Create Second Store
  await runTest("CREATE FASHION STORE", async () => {
    const res = await api.post("/stores", {
      name: "Fashion Hub Boutique",
      email: "info@fashionhub.com",
      address: "456 Fashion Avenue",
      ownerId: OWNER_ID,
    });

    console.log(res.data);
  });

  // 3 View Stores
  await runTest("GET ALL STORES", async () => {
    const res = await api.get("/stores");

    console.log("Store Count:", res.data.count);

    console.table(
      res.data.stores.map((store) => ({
        id: store.id,
        name: store.name,
        email: store.email,
        owner: store.owner?.name,
        averageRating: store.averageRating,
      }))
    );
  });

  // 4 Missing Fields Validation
  await runTest("MISSING REQUIRED FIELDS", async () => {
    await api.post("/stores", {
      name: "Invalid Store",
    });
  });

  // 5 Invalid Owner
  await runTest("INVALID OWNER", async () => {
    await api.post("/stores", {
      name: "Test Store Name Here",
      email: "test@store.com",
      address: "Test Address",
      ownerId: 99999,
    });
  });

  // 6 Duplicate Email
  await runTest("DUPLICATE STORE EMAIL", async () => {
    await api.post("/stores", {
      name: "Duplicate Store",
      email: "contact@techsolutions.com",
      address: "Duplicate Address",
      ownerId: OWNER_ID,
    });
  });

  // 7 Final Store List
  await runTest("FINAL STORE LIST", async () => {
    const res = await api.get("/stores");

    console.table(
      res.data.stores.map((store) => ({
        id: store.id,
        name: store.name,
        owner: store.owner?.name,
        averageRating: store.averageRating,
      }))
    );
  });

  console.log("\n🎉 STORE TESTING COMPLETED");
}

main();