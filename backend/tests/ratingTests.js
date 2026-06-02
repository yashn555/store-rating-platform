const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Replace with your USER token
const USER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODA0MTc1NzIsImV4cCI6MTc4MTAyMjM3Mn0._RvP1qbbtXy7Bkj5C8Vsd41Sb6RIFv5X5nnQr3XBYOs";

let ratingId = null;

const headers = {
  Authorization: `Bearer ${USER_TOKEN}`,
  "Content-Type": "application/json",
};

async function testSubmitRating() {
  console.log("\n==================================================");
  console.log("TEST: SUBMIT RATING");
  console.log("==================================================");

  try {
    const response = await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 1,
        rating: 5,
      },
      { headers }
    );

    console.log(response.data);

    ratingId = response.data.rating.id;

    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");
    console.log(error.response?.status);
    console.log(error.response?.data);
  }
}

async function testSubmitSecondRating() {
  console.log("\n==================================================");
  console.log("TEST: SUBMIT SECOND STORE RATING");
  console.log("==================================================");

  try {
    const response = await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 2,
        rating: 4,
      },
      { headers }
    );

    console.log(response.data);
    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");
    console.log(error.response?.status);
    console.log(error.response?.data);
  }
}

async function testInvalidLowRating() {
  console.log("\n==================================================");
  console.log("TEST: INVALID LOW RATING");
  console.log("==================================================");

  try {
    await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 1,
        rating: 0,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testInvalidHighRating() {
  console.log("\n==================================================");
  console.log("TEST: INVALID HIGH RATING");
  console.log("==================================================");

  try {
    await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 1,
        rating: 6,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testDecimalRating() {
  console.log("\n==================================================");
  console.log("TEST: DECIMAL RATING");
  console.log("==================================================");

  try {
    await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 1,
        rating: 4.5,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testDuplicateRating() {
  console.log("\n==================================================");
  console.log("TEST: DUPLICATE RATING");
  console.log("==================================================");

  try {
    await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 1,
        rating: 3,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testUpdateRating() {
  console.log("\n==================================================");
  console.log("TEST: UPDATE RATING");
  console.log("==================================================");

  try {
    const response = await axios.put(
      `${BASE_URL}/api/ratings/${ratingId}`,
      {
        rating: 4,
      },
      { headers }
    );

    console.log(response.data);
    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");
    console.log(error.response?.data);
  }
}

async function testUpdateInvalidRating() {
  console.log("\n==================================================");
  console.log("TEST: UPDATE INVALID RATING");
  console.log("==================================================");

  try {
    await axios.put(
      `${BASE_URL}/api/ratings/${ratingId}`,
      {
        rating: 7,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testRatingNotFound() {
  console.log("\n==================================================");
  console.log("TEST: RATING NOT FOUND");
  console.log("==================================================");

  try {
    await axios.put(
      `${BASE_URL}/api/ratings/999`,
      {
        rating: 3,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testStoreNotFound() {
  console.log("\n==================================================");
  console.log("TEST: STORE NOT FOUND");
  console.log("==================================================");

  try {
    await axios.post(
      `${BASE_URL}/api/ratings`,
      {
        storeId: 999,
        rating: 5,
      },
      { headers }
    );

    console.log("❌ FAILED");
  } catch (error) {
    console.log(error.response.data);
    console.log("✅ PASSED");
  }
}

async function testViewStoresAverageRating() {
  console.log("\n==================================================");
  console.log("TEST: VIEW STORES WITH AVERAGE RATING");
  console.log("==================================================");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/stores`,
      { headers }
    );

    console.table(
      response.data.stores.map((store) => ({
        id: store.id,
        name: store.name,
        averageRating: store.averageRating,
      }))
    );

    console.log("✅ PASSED");
  } catch (error) {
    console.log("❌ FAILED");
    console.log(error.response?.data);
  }
}

async function runTests() {
  await testSubmitRating();
  await testSubmitSecondRating();

  await testInvalidLowRating();
  await testInvalidHighRating();
  await testDecimalRating();

  await testDuplicateRating();

  await testUpdateRating();
  await testUpdateInvalidRating();

  await testRatingNotFound();
  await testStoreNotFound();

  await testViewStoresAverageRating();

  console.log("\n🎉 RATING TESTING COMPLETED");
}

runTests();