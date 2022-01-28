require("dotenv").config();
const express = require("express");
const multer = require("multer");
const yourid = require("yourid");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },

    filename: (req, file, cb) => {
        cb(null, yourid.generate(15) + "-" + file.originalname);
    },
});

const upload = multer({
    storage: fileStorage,
});

app.post("/api/upload/single", upload.single("image"), (req, res) => {
    image = req.file.filename;

    res.render("upload");
});

app.post("/api/upload/multiple", upload.array("images", 3), (req, res) => {
    res.send("File upload multiple success!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
