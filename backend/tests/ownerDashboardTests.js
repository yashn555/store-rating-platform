const axios = require("axios");

const BASE_URL = "http://localhost:5000";

const OWNER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJvd25lckBleGFtcGxlLmNvbSIsInJvbGUiOiJvd25lciIsImlhdCI6MTc4MDQxODM3MSwiZXhwIjoxNzgxMDIzMTcxfQ.BDaMYS6zWBLFTrto15_7YkK3viWTkCJ0gyoAnbMunz0";
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODA0MTc1NzIsImV4cCI6MTc4MTAyMjM3Mn0._RvP1qbbtXy7Bkj5C8Vsd41Sb6RIFv5X5nnQr3XBYOs";
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MDQxNTczMywiZXhwIjoxNzgxMDIwNTMzfQ.6HAGb-1Hwlp0PJ3JdPMS1YFvKCAMipAQ_4Yitz-DAEk";

async function testOwnerDashboard() {
  console.log("\n==================================================");
  console.log("TEST: OWNER DASHBOARD");
  console.log("==================================================");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/owner/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${OWNER_TOKEN}`,
        },
      }
    );

    console.log("Status:", response.status);

    if (response.data.data?.stores) {
      console.table(
        response.data.data.stores.map((store) => ({
          storeId: store.storeId,
          storeName: store.storeName,
          averageRating: store.averageRating,
          totalRatings: store.totalRatings,
        }))
      );
    }

    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");
    console.log(error.response?.data);
  }
}

async function testUserAccess() {
  console.log("\n==================================================");
  console.log("TEST: USER ACCESS DENIED");
  console.log("==================================================");

  try {
    await axios.get(`${BASE_URL}/api/owner/dashboard`, {
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
    });

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testAdminAccess() {
  console.log("\n==================================================");
  console.log("TEST: ADMIN ACCESS DENIED");
  console.log("==================================================");

  try {
    await axios.get(`${BASE_URL}/api/owner/dashboard`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testNoToken() {
  console.log("\n==================================================");
  console.log("TEST: NO TOKEN");
  console.log("==================================================");

  try {
    await axios.get(`${BASE_URL}/api/owner/dashboard`);

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function runTests() {
  await testOwnerDashboard();
  await testUserAccess();
  await testAdminAccess();
  await testNoToken();

  console.log("\n🎉 OWNER DASHBOARD TESTS COMPLETED");
}

runTests();