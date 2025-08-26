// import express from "express";
// import fetch from "node-fetch";
// import ytdl from "@distube/ytdl-core";


// const app = express();
// const PORT = 8080;

// app.use(express.static("public"));

// // ✅ Existing feature: fetch video info using node-fetch
// app.get("/info", async (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).send({ error: "No URL provided" });

//   try {
//     // Call YouTube oEmbed API to fetch metadata
//     const apiUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
//       url
//     )}&format=json`;

//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: "Failed to fetch video info" });
//   }
// });

// // ✅ New feature: download video using ytdl-core
// app.get("/download", async (req, res) => {
//   let videoUrl = req.query.url;
//   if (!videoUrl) return res.status(400).send("No video URL provided");

//   try {
//     console.log("Downloading:", videoUrl);

//     // Convert shorts link to watch?v= format
//     if (videoUrl.includes("shorts/")) {
//       const id = videoUrl.split("shorts/")[1].split("?")[0];
//       videoUrl = `https://www.youtube.com/watch?v=${id}`;
//       console.log("Converted URL:", videoUrl);
//     }

//     if (!ytdl.validateURL(videoUrl)) {
//       return res.status(400).send("Invalid YouTube URL");
//     }

//     const info = await ytdl.getInfo(videoUrl);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");

//     res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
//     res.header("Content-Type", "video/mp4");

//     ytdl(videoUrl, { quality: "highest" })
//       .on("error", (err) => {
//         console.error("YTDL Error:", err);
//         res.status(500).send("Download failed");
//       })
//       .pipe(res);

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).send("Error downloading video");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


// import express from "express";
// import fetch from "node-fetch";
// import ytdl from "@distube/ytdl-core";
// import path from "path";

// const app = express();
// const PORT = 3000;

// app.use(express.static("public"));

// // 🎯 Download in highest quality
// app.get("/download", async (req, res) => {
//   const videoURL = req.query.url;

//   if (!videoURL) {
//     return res.status(400).send("No URL provided");
//   }

//   try {
//     // Get video info
//     const info = await ytdl.getInfo(videoURL);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");

//     // Force highest quality
//     const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

//     res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);

//     ytdl(videoURL, { format })
//       .pipe(res)
//       .on("error", (err) => {
//         console.error("Download error:", err);
//         res.status(500).send("Error downloading video");
//       });

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).send("Error downloading video");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




// import express from "express";
// import fetch from "node-fetch";
// import path from "path";
// import { fileURLToPath } from "url";
// import ytdl from "@distube/ytdl-core";

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "public")));

// // Video info fetch route
// app.get("/videoInfo", async (req, res) => {
//   try {
//     const url = req.query.url;
//     if (!url) return res.status(400).send("No URL provided");

//     const info = await ytdl.getInfo(url);
//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails[0].url,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching video info");
//   }
// });

// // ✅ Quick Fix Download (audio + video combined, up to 720p)
// app.get("/download", async (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).send("No URL provided");

//   try {
//     console.log("Downloading (quick fix):", url);
//     res.header("Content-Disposition", 'attachment; filename="video.mp4"');

//     // highest = best combined (video+audio)
//     ytdl(url, { quality: "highest" }).pipe(res);

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).send("Error downloading video");
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );




// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import ytdl from "@distube/ytdl-core";
// import ffmpeg from "fluent-ffmpeg";
// import fs from "fs";
// import os from "os";

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/download", async (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).send("No URL provided");

//   // Temp files for video + audio
//   const videoPath = path.join(os.tmpdir(), `video_${Date.now()}.mp4`);
//   const audioPath = path.join(os.tmpdir(), `audio_${Date.now()}.mp4`);
//   const outputPath = path.join(os.tmpdir(), `output_${Date.now()}.mp4`);

//   try {
//     console.log("Downloading:", url);

//     // Save video & audio separately
//     await new Promise((resolve, reject) => {
//       const stream = ytdl(url, { quality: "highestvideo" })
//         .pipe(fs.createWriteStream(videoPath));
//       stream.on("finish", resolve);
//       stream.on("error", reject);
//     });

//     await new Promise((resolve, reject) => {
//       const stream = ytdl(url, { quality: "highestaudio" })
//         .pipe(fs.createWriteStream(audioPath));
//       stream.on("finish", resolve);
//       stream.on("error", reject);
//     });

//     console.log("Video & audio downloaded. Merging...");

//     // Merge using ffmpeg
//     await new Promise((resolve, reject) => {
//       ffmpeg()
//         .input(videoPath)
//         .input(audioPath)
//         .outputOptions(["-c:v copy", "-c:a aac"])
//         .save(outputPath)
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     console.log("Merge complete. Sending file...");

//     res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
//     res.setHeader("Content-Type", "video/mp4");

//     const readStream = fs.createReadStream(outputPath);
//     readStream.pipe(res);

//     // Cleanup after streaming finishes
//     readStream.on("close", () => {
//       fs.unlink(videoPath, () => {});
//       fs.unlink(audioPath, () => {});
//       fs.unlink(outputPath, () => {});
//     });

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).send("Error downloading video");
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );


// import express from "express";
// import fetch from "node-fetch";
// import ytdl from "@distube/ytdl-core";
// import fs from "fs";
// import { exec } from "child_process";
// import path from "path";

// const app = express();
// const PORT = 3000;

// app.use(express.static("public"));

// // Fetch video info
// app.get("/fetch", async (req, res) => {
//   const url = req.query.url;
//   if (!ytdl.validateURL(url)) {
//     return res.status(400).json({ error: "Invalid YouTube URL" });
//   }
//   try {
//     const info = await ytdl.getInfo(url);
//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails.pop().url,
//       duration: info.videoDetails.lengthSeconds,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch video info" });
//   }
// });

// // Download highest quality (parallel video+audio)
// app.get("/download", async (req, res) => {
//   const url = req.query.url;
//   if (!ytdl.validateURL(url)) {
//     return res.status(400).send("Invalid URL");
//   }

//   try {
//     const info = await ytdl.getInfo(url);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
//     const videoPath = path.resolve(`video_${Date.now()}.mp4`);
//     const audioPath = path.resolve(`audio_${Date.now()}.mp3`);
//     const outputPath = path.resolve(`${title}_${Date.now()}.mp4`);

//     // Download both in parallel
//     const videoStream = ytdl(url, { quality: "highestvideo" }).pipe(fs.createWriteStream(videoPath));
//     const audioStream = ytdl(url, { quality: "highestaudio" }).pipe(fs.createWriteStream(audioPath));

//     // Wait for both streams to finish
//     await Promise.all([
//       new Promise((resolve) => videoStream.on("finish", resolve)),
//       new Promise((resolve) => audioStream.on("finish", resolve)),
//     ]);

//     // Merge with ffmpeg
//     exec(
//       `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac "${outputPath}"`,
//       (err) => {
//         fs.unlinkSync(videoPath);
//         fs.unlinkSync(audioPath);

//         if (err) {
//           console.error("FFmpeg error:", err);
//           return res.status(500).send("Error merging video/audio");
//         }

//         res.download(outputPath, `${title}.mp4`, (downloadErr) => {
//           if (!downloadErr) {
//             fs.unlinkSync(outputPath);
//           }
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Download error:", error);
//     res.status(500).send("Error downloading video");
//   }
// });

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));



// import express from "express";
// import fetch from "node-fetch";
// import ytdl from "@distube/ytdl-core";
// import cp from "child_process";
// import stream from "stream";
// import { pipeline } from "stream";

// const app = express();
// const PORT = 3000;

// app.use(express.static("public"));

// app.get("/info", async (req, res) => {
//   try {
//     const url = req.query.url;
//     if (!ytdl.validateURL(url)) {
//       return res.status(400).json({ error: "Invalid YouTube URL" });
//     }
//     const info = await ytdl.getInfo(url);
//     res.json({
//       title: info.videoDetails.title,
//       thumbnail: info.videoDetails.thumbnails.pop().url,
//       url
//     });
//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ error: "Failed to fetch video info" });
//   }
// });

// // ✅ Optimized highest quality download
// app.get("/download", async (req, res) => {
//   try {
//     const url = req.query.url;
//     if (!ytdl.validateURL(url)) {
//       return res.status(400).send("Invalid URL");
//     }

//     const info = await ytdl.getInfo(url);
//     const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");

//     res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
//     res.header("Content-Type", "video/mp4");

//     // ffmpeg process
//     const ffmpegProcess = cp.spawn("ffmpeg", [
//       "-loglevel", "error",
//       "-i", "pipe:3", // video
//       "-i", "pipe:4", // audio
//       "-map", "0:v",
//       "-map", "1:a",
//       "-c:v", "copy",
//       "-c:a", "aac",
//       "-f", "mp4",
//       "-movflags", "frag_keyframe+empty_moov", // 👈 allow streaming mp4
//       "pipe:5"
//     ], {
//       stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"]
//     });

//     // video + audio
//     const video = ytdl(url, { quality: "highestvideo" });
//     const audio = ytdl(url, { quality: "highestaudio" });

//     // pipe them
//     pipeline(video, ffmpegProcess.stdio[3], (err) => {
//       if (err) console.error("Video stream error:", err.message);
//     });
//     pipeline(audio, ffmpegProcess.stdio[4], (err) => {
//       if (err) console.error("Audio stream error:", err.message);
//     });

//     // send output to client
//     pipeline(ffmpegProcess.stdio[5], res, (err) => {
//       if (err) {
//         console.error("FFmpeg pipeline error:", err.message);
//         if (!res.headersSent) {
//           res.status(500).send("Error downloading video");
//         }
//       }
//     });

//   } catch (err) {
//     console.error("Download route error:", err);
//     res.status(500).send("Error downloading video");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


import express from "express";
import { pipeline } from "stream";
import cp from "child_process";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // if you have index.html in public/

// ✅ Download route (Option 1)
app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send("Invalid URL");
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");
    const tempFile = path.join(__dirname, `${title}.mp4`);

    const ffmpegProcess = cp.spawn("ffmpeg", [
      "-loglevel", "error",
      "-i", "pipe:3",
      "-i", "pipe:4",
      "-map", "0:v",
      "-map", "1:a",
      "-c:v", "copy",
      "-c:a", "aac",
      "-movflags", "faststart",   // 👈 Makes file seekable
      tempFile
    ], {
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe"]
    });

    const video = ytdl(url, { quality: "highestvideo" });
    const audio = ytdl(url, { quality: "highestaudio" });

    pipeline(video, ffmpegProcess.stdio[3], (err) => {
      if (err) console.error("Video stream error:", err.message);
    });
    pipeline(audio, ffmpegProcess.stdio[4], (err) => {
      if (err) console.error("Audio stream error:", err.message);
    });

    ffmpegProcess.on("close", () => {
      res.download(tempFile, `${title}.mp4`, (err) => {
        if (err) console.error("Download error:", err);
        fs.unlinkSync(tempFile); // cleanup
      });
    });

  } catch (err) {
    console.error("Download route error:", err);
    res.status(500).send("Error downloading video");
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
