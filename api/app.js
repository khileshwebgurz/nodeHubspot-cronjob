
const axios = require("axios");

const dotenv = require("dotenv");

dotenv.config();



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
    return longLivedToken;
  } catch (err) {
    console.error("Error refreshing token:", err.response?.data || err.message);
  }
}

module.exports = async (req, res) => {
  const token = await refreshToken();
  res.json({ access_token: token });
};
