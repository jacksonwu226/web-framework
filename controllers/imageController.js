const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const asyncHandler = require('express-async-handler');
const ort = require("onnxruntime-node");
const sharp = require('sharp');

exports.index = (req,res, next) => {
  res.render('index',{
    title: 'Web ML Framework'
  })
}

exports.image_upload_get = (req, res, next) =>{
  res.render('image_upload', {
    
  })
}
// exports.image_upload_post = asyncHandler(async(req, res, next) =>{
//   const imgBuffer = req.file.buffer;

//   const imgBase64 = imgBuffer.toString('base64');

//   const sharpImg = sharp(imgBuffer);
//   const metadata = await sharpImg.metadata();
//   const width = metadata.width;
//   const height = metadata.height;
//   console.log(`w:${width} x h:${height}`)

//   res.render('image_result',{
//     image_src: `data:${req.file.mimetype};base64,${imgBase64}`,
//     width: width,
//     height: height
//   })
// })
exports.image_upload_post = asyncHandler(async(req,res,next)  => {
  const imgBuffer = req.file.buffer;

  // get image metadata
  const sharpImg = sharp(imgBuffer);
  const metadata = await sharpImg.metadata();
  const width = metadata.width;
  const height = metadata.height;

  const rawPixelData = await sharp(imgBuffer)
    .raw()
    .toBuffer();
  // const session = await ort.InferenceSession.create('../model.onnx');
  const data = Uint8Array.from(rawPixelData);
  console.log(data);

  const tensor = new ort.Tensor('uint8', rawPixelData, [1, width, height, 3]);
  const feeds = {input: tensor};
  // const results = await session.run(feeds);

  const imgBase64 = imgBuffer.toString('base64');

  res.render('image_result',{
    image_src: `data:${req.file.mimetype};base64,${imgBase64}`,
    width: width,
    height: height
  })
});

exports.image_result_get = (req,res,next) => {
  res.send("image result get");
};