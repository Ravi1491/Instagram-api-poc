require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
const CronJob = require("cron").CronJob;
const IG_USERNAME = "demoapp88";
const IG_PASSWORD = "test@123";
const ig = new IgApiClient();
ig.state.generateDevice(IG_USERNAME);

const postToInsta = async () => {
  await ig.account.login(IG_USERNAME, IG_PASSWORD);
  const img1Buffer = await get({
    url: "https://images.unsplash.com/photo-1706391989349-7882ece26c0c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    encoding: null,
  });

  console.log("Uploading image to instagram");

  await ig.publish.photo({
    file: img1Buffer,
    caption: "Really nice photo from the internet!",
  });
};

const postAlubmToInsta = async () => {
  await ig.account.login(IG_USERNAME, IG_PASSWORD);
  const img1Buffer = await get({
    url: "https://images.unsplash.com/photo-1706391989349-7882ece26c0c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    encoding: null,
  });

  const img2Buffer = await get({
    url: "https://images.unsplash.com/photo-1706313293815-545e6da761be?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    encoding: null,
  });

  const img3Buffer = await get({
    url: "https://images.unsplash.com/photo-1706361635623-6606c945503e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    encoding: null,
  });

  const albumImageBuffer = [
    { file: img1Buffer },
    { file: img2Buffer },
    { file: img3Buffer },
  ];

  await ig.publish.album({
    items: albumImageBuffer,
    caption: "Alubm caption",
  });
};

const postStoryToInsta = async () => {
  await ig.account.login(IG_USERNAME, IG_PASSWORD);
  const img1Buffer = await get({
    url: "https://images.unsplash.com/photo-1706391989349-7882ece26c0c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    encoding: null,
  });

  await ig.publish.story({
    file: img1Buffer,
  });
};

const fs = require("fs");

const videoFilePath = "./reel.mp4";

function readVideoIntoBuffer(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const createReel = async () => {
  await ig.account.login(IG_USERNAME, IG_PASSWORD);

  let videoBuffer;

  readVideoIntoBuffer(videoFilePath)
    .then(async (buffer) => {
      videoBuffer = buffer;
      // Use the buffer as needed, e.g., upload it to a server or process it further.
      console.log("Video loaded into buffer successfully.", videoBuffer);

      const xyz = await ig.upload.video({
        video: videoBuffer,
        duration: 60,
      });

      console.log(typeof xyz.media_id, "xyz", xyz);
      await ig.highlights.createReel({
        mediaIds: [xyz.media_id],
        title: "My Reel",
      });
    })
    .catch((error) => {
      console.error("Error reading video file:", error);
    });
};

// postToInsta();
// postAlubmToInsta();
// postStoryToInsta();
createReel();
