const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

exports.index = (req,res, next) => {
  res.render('index',{
    title: 'Web ML Framework'
  })
}

exports.image_upload_get = (req, res, next) =>{
  res.render('image_upload', {
    
  })
}
exports.image_upload_post = (req, res, next) =>{
  const imgBuffer = req.file.buffer;

  const imgBase64 = imgBuffer.toString('base64');

  res.render('image_result',{
    image_src: `data:${req.file.mimetype};base64,${imgBase64}`
  })
}
exports.image_result_get = (req,res,next) => {
  res.send("image result get");
}