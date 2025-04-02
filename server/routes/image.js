const express = require("express");
const router = express.Router();
const { imageUpload } = require("../middlewares/imageUpload");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: "ap-northeast-1", // Specify your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = {
  Bucket: "erb-9-dance-platform/avatar", // 相簿位子
  Key: "Test", // 你希望儲存在 S3 上的檔案名稱
  Body: req.file.buffer, // 檔案
  ACL: "public-read", // 檔案權限
  ContentType: req.file.mimetype, // 副檔名
};

router.use(
  "/upload",
  profileUpload.single("profile_img"),
  async (req, res, next) => {
    try {
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);
      console.log("Upload Successful", data);
      res.send("OK");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
    }
  }
);

module.exports = router;
