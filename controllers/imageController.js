const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const asyncHandler = require('express-async-handler');
const ort = require("onnxruntime-node");
const sharp = require('sharp');
const path = require('path');
exports.index = (req,res, next) => {
  res.render('index',{
    title: 'Web ML Framework'
  })
}

function postProcess(data){
  const arrayData = Array.prototype.slice.call(data);
  const score = softmax(arrayData);
  const topK = getTopKPred(score, 5);
  return topK;
}

function softmax(logits) {
  //find max in logits using reduce
  const maxLogit = logits.reduce((a, b) => Math.max(a, b), -Infinity);
  const scores = logits.map((l) => Math.exp(l - maxLogit));
  const denom = scores.reduce((a, b) => a + b);
  return scores.map((s) => s / denom);
}

function getTopKPred(data, K=1){
  const topKResults = data.map((val,index) =>({val,index}))
    .sort((a, b) => b.val - a.val)
    .slice(0, K) // Take the top K
  return topKResults;
}
exports.image_upload_get = (req, res, next) =>{
  res.render('image_upload');
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
  const session = await ort.InferenceSession.create('/home/jacksonwu226/repos/web-ml-framework/models/mobilenetv2-12-preprocess.onnx');
  const data = Uint8Array.from(rawPixelData);

  const tensor = new ort.Tensor('uint8', data, [1, height, width, 3]);
  const feeds = {X: tensor};
  const results = await session.run(feeds);
  const resultProcess = postProcess(results.output.cpuData);
  const imgBase64 = imgBuffer.toString('base64');
  console.log(resultProcess);
  console.log(postProcess);
  res.render('image_result',{
    image_src: `data:${req.file.mimetype};base64,${imgBase64}`,
    width: width,
    height: height
  })
});

exports.image_result_get = (req,res,next) => {
  res.send("image result get");
};