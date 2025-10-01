const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let longLivedToken = process.env.FB_LONG_LIVED_USER_TOKEN;

async function refreshToken() {
  try {
    const res = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.FB_APP_ID,
          client_secret: process.env.FB_APP_SECRET,
          fb_exchange_token: longLivedToken,
        },
      }
    );
    longLivedToken = res.data.access_token;
    console.log("Token refreshed:", longLivedToken);
  } catch (err) {
    console.error("Error refreshing token:", err.response?.data || err.message);
  }
}

cron.schedule("* * * * *", () => {
  console.log("Running scheduled token refresh...");
  refreshToken();
});

app.get("/get-token", (req, res) => {
  res.json({ access_token: longLivedToken });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
