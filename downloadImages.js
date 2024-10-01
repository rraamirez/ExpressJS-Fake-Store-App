import fs from 'fs';
import https from 'https';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;
const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = 'myProject';

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve); 
      });
    }).on('error', (err) => {
      fs.unlink(filepath); 
      reject(err);
    });
  });
};

async function downloadProductImages() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const products = await db.collection('productos').find({}).toArray();

    const dir = './images';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    for (const product of products) {
      const imageUrl = product.image;
      const filename = `${dir}/${product.id}.jpg`;
      await downloadImage(imageUrl, filename);
      console.log(`Downloaded image for product ${product.id}`);
    }

  } catch (err) {
    console.error('Error downloading images:', err);
  } finally {
    await client.close();
  }
}

downloadProductImages();
