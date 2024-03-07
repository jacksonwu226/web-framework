const express = require("express");
const router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const image_controller = require("../controllers/imageController");
router.get("/", image_controller.index);
router.get("/upload", image_controller.image_upload_get);
router.post("/upload",upload.single('image'), image_controller.image_upload_post);
router.get("/result", image_controller.image_result_get)

module.exports = router;