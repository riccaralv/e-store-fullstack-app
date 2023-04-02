import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  data: { type: Buffer, required: true },
  // el package fileupload automáticamente transforma el file (imagen) en un buffer
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
});

const ImageCollection = model('images', imageSchema);

export default ImageCollection;
