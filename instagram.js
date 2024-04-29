const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = 3000;

const CLIENT_ID = "1048560986406362";
// const CLIENT_SECRET = "1acab80c7ce64e2c926ea7e874f5e96b";
const CLIENT_SECRET = "69c0d313299e98339f3480d3864a35d8";
const REDIRECT_URI = "https://9895-112-196-47-10.ngrok-free.app/callback";
const SCOPE = "user_profile,user_media";

// Step 1: Redirect users to the Instagram authorization URL
app.get("/login", (req, res) => {
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=code`;
  // const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${state}`;
  res.redirect(authUrl);
});

// https://graph.facebook.com/v12.0/oauth/access_token

// Step 2: Handle the callback from Instagram
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  console.log("wadsf ", req.query);

  // Step 3: Exchange the authorization code for an access token
  const tokenUrl = "https://api.instagram.com/oauth/access_token";
  const tokenParams = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(
      tokenUrl,
      querystring.stringify(tokenParams)
    );
    const accessToken = response.data.access_token;
    console.log("accessToken ", accessToken);
    // Step 4: Use the access token to make API requests
    // You can now use the accessToken to make authenticated requests to the Instagram API

    // Example: Fetch user profile
    const userProfileUrl = `https://graph.instagram.com/v12.0/me?fields=id,username&access_token=${accessToken}`;
    const profileResponse = await axios.get(userProfileUrl);
    const userProfile = profileResponse.data;
    // console.log("userProfile ", userProfile);
    // Example: Fetch user media
    const userMediaUrl = `https://graph.instagram.com/v12.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;
    const mediaResponse = await axios.get(userMediaUrl);
    const userMedia = mediaResponse.data;
    // console.log("userMedia ", userMedia);

    // post media
    const postMediaUrl = `https://graph.instagram.com/v12.0/17841444778996453/media?image_url=https://images.unsplash.com/photo-1682685797769-481b48222adf?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&access_token=${accessToken}`;
    const postMediaResponse = await axios.post(postMediaUrl);
    const postMedia = postMediaResponse.data;
    console.log("postMedia ", postMedia);

    // Display user profile and media
    res.json({ userProfile, userMedia });
  } catch (error) {
    console.error("Error exchanging code for access token:", error.message);
    res.status(500).send("Error exchanging code for access token");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
