const cloudinary = require('cloudinary');

//config
cloudinary.config({
  cloud_name: 'dmogm3l4v',
  api_key: '878533416185997',
  api_secret: 'oeZA84LSJraUW4AI7dF3hoyIUc8',
});

exports.upload = async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto',
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

exports.remove = (req, res) => {
  let image_id = req.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send('ok');
  });
};
