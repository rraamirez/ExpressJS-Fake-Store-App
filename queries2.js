import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); //loads environment variables from the .env file

const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = "myProject";

// async function getExpensiveProducts() {
//   try {
//     await client.connect();
//     const db = client.db(dbName);

//     const products = await db
//       .collection("productos")
//       .find({ price: { $gt: 100 } })
//       .toArray();

//     console.log(
//       `${products.length} products found with a value higher than 100$:`
//     );

//     products.forEach((product) => {
//       console.log(`Product: ${product.title}, Price: ${product.price} $`);
//     });
//   } catch (err) {
//     console.error("Error fetching products:", err);
//   } finally {
//     await client.close();
//   }
// }
async function getExpensiveProducts() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db.collection("productos").find().toArray();
    const filteredProducts = products.filter((product) => product.price > 100);

    console.log(
      filteredProducts.length + " products found with a value higher than 100$:"
    );
     
    for (let i = 0; i < filteredProducts.length; i++) {
      const product = filteredProducts[i];
      console.log("Product: " + product.title + ", Price: " + product.price + " $");
    }
     
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getWinterProductsSortedByPrice() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db
      .collection("productos")
      .find({ description: { $regex: /winter/i } })
      .sort({ price: 1 })  //descent way: -1
      .toArray();

    console.log(`${products.length} winter products found:`);
    products.forEach((producto) => {
      console.log(`Product: ${producto.title}, Price: ${producto.price} $`);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getJeweleryProductsSortedByPrice() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db
      .collection("productos")
      .find({ category: "jewelery" })
      .sort({ price: 1 })
      .toArray();

    console.log(`${products.length} jewelry products found:`);
    products.forEach((producto) => {
      console.log(`Product: ${producto.title}, Price: ${producto.price} $`);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getTotalReviews() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db.collection("productos").find({}).toArray();

    let totalReviews = 0;
    products.forEach((producto) => {
      totalReviews += producto.rating.count;
    });

    console.log(`Total reviews: ${totalReviews}`);
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getAverageScoreByCategory() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db.collection("productos").find({}).toArray();
    const categoryScores = {};

    products.forEach((producto) => {
      const category = producto.category;

      if (!categoryScores[category]) {
        categoryScores[category] = { totalReviews: 0, totalScore: 0 };
      }

      categoryScores[category].totalReviews += producto.rating.count;
      categoryScores[category].totalScore +=
        producto.rating.rate * producto.rating.count;
    });

    for (const category in categoryScores) {
      const { totalReviews, totalScore } = categoryScores[category];
      const averageScore = totalReviews > 0 ? totalScore / totalReviews : 0;
      console.log(
        `Category: ${category}, Average Score: ${averageScore.toFixed(2)}`
      );
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getUsersWithoutDigitsInPassword() {
  try {
    await client.connect();
    const db = client.db(dbName);

    //not operator que invierte consulta en mongo, y la d es el regex que representa un digito
    const users = await db
      .collection("usuarios")
      .find({ password: { $not: /\d/ } })
      .toArray();

    console.log(
      `${users.length} users found without digits in their password:`
    );
    users.forEach((usuario) => {
      console.log(`User: ${usuario.username}, Password: ${usuario.password}`);
    });
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    await client.close();
  }
}

getExpensiveProducts();
// getWinterProductsSortedByPrice();
// getJeweleryProductsSortedByPrice();
// getTotalReviews();
// getAverageScoreByCategory();
// getUsersWithoutDigitsInPassword();

/*
Mongodump: 
primero acceder a la terminal del contedor de mongo con docker exec -it <container_id> bash
docker exec -it enviroment0-mongo-1 bash
mongo --version
*/
