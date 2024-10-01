import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = "myProject";

async function getExpensiveProducts(db) {
  try {
    const products = await db
      .collection("productos")
      .find({})
      .filter((product) => product.price > 100)
      .toArray();

    console.log(
      `${products.length} products found with a value higher than 100$:`
    );
    products.forEach((producto) => {
      console.log(`Product: ${producto.title}, Price: ${producto.price} $`);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

async function getWinterProductsSortedByPrice(db) {
  try {
    const products = await db
      .collection("productos")
      .find({ description: { $regex: /winter/i } })
      .sort({ price: 1 })
      .toArray();

    console.log(`${products.length} winter products found:`);
    products.forEach((producto) => {
      console.log(`Product: ${producto.title}, Price: ${producto.price} $`);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

async function getJeweleryProductsSortedByPrice(db) {
  try {
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
  }
}

async function getTotalReviews(db) {
  try {
    const products = await db.collection("productos").find({}).toArray();

    let totalReviews = 0;
    products.forEach((producto) => {
      totalReviews += producto.rating.count;
    });

    console.log(`Total reviews: ${totalReviews}`);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

async function getAverageScoreByCategory(db) {
  try {
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
  }
}

async function getUsersWithoutDigitsInPassword(db) {
  try {
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
  }
}

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);

    await getExpensiveProducts(db);
    await getWinterProductsSortedByPrice(db);
    await getJeweleryProductsSortedByPrice(db);
    await getTotalReviews(db);
    await getAverageScoreByCategory(db);
    await getUsersWithoutDigitsInPassword(db);
  } catch (err) {
    console.error("Error running operations:", err);
  } finally {
    await client.close();
  }
}

run();
