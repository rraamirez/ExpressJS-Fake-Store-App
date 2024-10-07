import fs from 'fs';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;
const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = 'myProject';

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)  
      .once('close', () => resolve(filepath)); 
  });
}

async function downloadProductImages() {
  try {
    await client.connect();  
    const db = client.db(dbName);
    const products = await db.collection('productos').find({}).toArray();  

    const dir = './images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);  
    }

    for (const product of products) {
      const imageUrl = product.image;
      const filename = dir + "/" + product.id + ".jpg";
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
//urls: https://flaviocopes.com/how-to-download-and-save-an-image-using-nodejs/
