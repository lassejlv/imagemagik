require("dotenv").config();
const express = require("express");
const multer = require("multer");
const yourid = require("yourid");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// the maximum size of the file to be uploaded
var maxSize = 1 * 2000 * 2000;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },

    filename: (req, file, cb) => {
        cb(null, yourid.generate(15) + "-" + file.originalname);
    },

    onFileUploadStart: function (file, req, res) {
        if (req.files.file.length > maxSize) {
            return false;
        }
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

app.get("/api/uploads", (req, res) => {
    const fs = require("fs");

    const key = req.query.key;

    if (key === process.env.KEY) {
        fs.readdir("public/uploads", (err, files) => {
            if (err) {
                console.log(err);
            } else {
                res.send(files);
            }
        });
    } else {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate(30),
            timestamp: new Date().toISOString(),
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
