import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: `${process.env.CLOUDINARY_FOLDER_NAME}`,
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const extractPublicId = imageUrl => {
  const startIndex = imageUrl.lastIndexOf('/', imageUrl.lastIndexOf('/') - 1) + 1;
  const endIndex = imageUrl.lastIndexOf('.');
  console.log(imageUrl.substring(startIndex, endIndex));
  return imageUrl.substring(startIndex, endIndex);
};

const deleteFromCloudinary = async imageUrl => {
  try {
    const image = extractPublicId(imageUrl);

    const response = await cloudinary.uploader.destroy(image);
    console.log(imageUrl, '----> ', response);
    return response;
  } catch (error) {
    console.log('Cloudinary Error: ', error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
