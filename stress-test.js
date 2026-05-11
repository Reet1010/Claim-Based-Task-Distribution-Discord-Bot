require("dotenv").config();
const mongoose = require("mongoose");
const { addRow } = require("./sheets");
const KarmaService = require("./services/karmaService");
const { performance } = require("perf_hooks");

async function simulateLoad(totalRequests, concurrency) {
  console.log(
    `🚀 Starting Stress Test: ${totalRequests} requests at ${concurrency} concurrency...`,
  );
  const start = performance.now();
  let successCount = 0;
  let failCount = 0;

  const tasks = Array.from({ length: totalRequests }, (_, i) => async () => {
    try {
      // SIMULATE: Adding a row to Google Sheets
      await addRow("StressTestSheet", [
        `Task-${i}`,
        "TestUser",
        "https://reddit.com",
        "https://reddit.com",
        "2024-01-01",
        "12:00",
        "1.0",
        "Completed",
      ]);

      // SIMULATE: Database range update
      await KarmaService.addUserToRange(
        { id: `user-${i}`, displayName: `Tester${i}` },
        "link",
        "A",
        "Admin",
      );

      successCount++;
    } catch (err) {
      console.error(`❌ Task-${i} failed:`, err.message);
      failCount++;
    }
  });

  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency).map((task) => task());
    await Promise.all(batch);
    console.log(`📈 Progress: ${i + batch.length}/${totalRequests}`);

    // Safety buffer for Google Sheets Quota (60 requests/min)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const end = performance.now();
  const duration = ((end - start) / 1000).toFixed(2);
  console.log(`\n🏁 TEST COMPLETE 🏁`);
  console.log(`⏱️ Duration: ${duration}s`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`🚀 Avg Speed: ${(totalRequests / duration).toFixed(2)} req/sec`);
}

// WRAPPER: Ensures DB connection is ready before testing
async function runTest() {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Discord-Bot-auto1";
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(uri);
    console.log("✅ Database Connected.");

    await simulateLoad(50, 5);
  } catch (error) {
    console.error("❌ Fatal Test Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database Disconnected.");
    process.exit(0);
  }
}

runTest();
