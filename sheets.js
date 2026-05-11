const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

let sheetsClient;
let initializationPromise = null;
const existingSheets = new Set();
const sheetCreationLocks = new Map(); // NEW: Track pending tab creations

async function getSheets() {
  if (sheetsClient) return sheetsClient;

  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        const client = await auth.getClient();
        sheetsClient = google.sheets({ version: "v4", auth: client });
        const res = await sheetsClient.spreadsheets.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });
        res.data.sheets.forEach((s) => existingSheets.add(s.properties.title));
        return sheetsClient;
      } catch (err) {
        initializationPromise = null;
        throw err;
      }
    })();
  }
  return initializationPromise;
}

async function ensureSheet(sheetName) {
  const sheets = await getSheets();
  if (existingSheets.has(sheetName)) return;

  // NEW: If this specific sheet is already being created, wait for that process
  if (sheetCreationLocks.has(sheetName)) {
    return sheetCreationLocks.get(sheetName);
  }

  const creationPromise = (async () => {
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${sheetName}!A:H`,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "TaskID",
              "Username",
              "Post URL",
              "Comment URL",
              "Date",
              "Time",
              "Price",
              "Status",
            ],
          ],
        },
      });

      existingSheets.add(sheetName);
    } catch (err) {
      // If error is just "already exists", we can ignore it and add to set
      if (err.message.includes("already exists")) {
        existingSheets.add(sheetName);
      } else {
        throw err;
      }
    } finally {
      sheetCreationLocks.delete(sheetName); // Clean up the lock
    }
  })();

  sheetCreationLocks.set(sheetName, creationPromise);
  return creationPromise;
}

async function addRow(sheetName, row, interaction = null) {
  try {
    const sheets = await getSheets();
    await ensureSheet(sheetName);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A:H`,
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });
  } catch (err) {
    console.error("❌ Google Sheets API Error:", err.message);
    if (interaction) {
      const errorPayload = {
        content:
          "❌ Failed to save data to Google Sheets. Please contact an admin.",
        flags: 64,
      };
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(errorPayload).catch(() => {});
      } else {
        await interaction.reply(errorPayload).catch(() => {});
      }
    }
    throw err;
  }
}

module.exports = { addRow };
