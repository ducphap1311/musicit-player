const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const videoInfo = await ytdl.getInfo(videoUrl);
        const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
        const urls = audioFormats.map((item) => {
            return item.url;
        });

        res.send(urls[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
