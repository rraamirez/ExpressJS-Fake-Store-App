import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); //for loading environment variables from the .env file

const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = "myProject";

async function getExpensiveProducts() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db.collection("productos").find().toArray();
    const filteredProducts = products.filter((product) => product.price > 100);

    console.log(filteredProducts.length + " products found with a value higher than 100$:");

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
      .sort({ price: 1 })  //si quieres que sea descendente: -1
      .toArray();

    console.log(products.length + " winter products found:");
    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      console.log("Product: " + producto.title + ", Price: " + producto.price + " $");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    await client.close();
  }
}

async function getJeweleryProductsSortedByRating() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db
      .collection("productos")
      .find({ category: "jewelery" })
      .toArray();

    for(let i = 0; i < products.length; i++) {
      for(let j = i + 1; j < products.length; j++) {
        if(products[i].rating.rate < products[j].rating.rate) {
          const aux = products[i];
          products[i] = products[j];
          products[j] = aux;
        }
      }
    }

    console.log(products.length + " jewelry products found:");
    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      console.log("Product: " + producto.title + ", Rating: " + producto.rating.rate);
    }
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

    const products = await db.collection("productos").find().toArray();

    let totalReviews = 0;
    for (let i = 0; i < products.length; i++) {
      totalReviews += products[i].rating.count;
    }

    console.log("Total reviews: " + totalReviews);
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

    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      const category = producto.category;

      if (!categoryScores[category]) {
        categoryScores[category] = { totalReviews: 0, totalScore: 0 };
      }

      categoryScores[category].totalReviews += producto.rating.count;
      categoryScores[category].totalScore += producto.rating.rate * producto.rating.count;
    }

    for (const category in categoryScores) {
      const totalReviews = categoryScores[category].totalReviews;
      const totalScore = categoryScores[category].totalScore;
      const averageScore = totalReviews > 0 ? totalScore / totalReviews : 0;
      console.log("Category: " + category + ", Average Score: " + averageScore.toFixed(2));
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
    //https://stackoverflow.com/questions/9184106/javascript-regular-expression-non-digit-character
    const users = await db
      .collection("usuarios")
      .find({ password: { $not: /\d/ } })
      .toArray();

    console.log(users.length + " users found without digits in their password:");
    for (let i = 0; i < users.length; i++) {
      const usuario = users[i];
      console.log("User: " + usuario.username + ", Password: " + usuario.password);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    await client.close();
  }
}

await getExpensiveProducts();
console.log("\n");
await getWinterProductsSortedByPrice();
console.log("\n");
await getJeweleryProductsSortedByRating();
console.log("\n");
await getTotalReviews();
console.log("\n");
await getAverageScoreByCategory();
console.log("\n");
await getUsersWithoutDigitsInPassword();

/*
Mongodump: 
PS C:\Users\raule\Desktop\Quinto\dai\enviroment0> docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED       STATUS         PORTS                      NAMES
00b3cfaa8010   mongo-express   "/sbin/tini -- /dock…"   10 days ago   Up 5 minutes   0.0.0.0:8081->8081/tcp     enviroment0-mongo-express-1
2dc0efcefe42   mongo           "docker-entrypoint.s…"   10 days ago   Up 5 minutes   0.0.0.0:27017->27017/tcp   enviroment0-mongo-1
PS C:\Users\raule\Desktop\Quinto\dai\enviroment0> docker exec -it enviroment0-mongo-1 mongodump --uri="mongodb://root:example@localhost:27017" --out /data/backup
2024-09-30T17:17:57.192+0000    writing admin.system.users to /data/backup/admin/system.users.bson
2024-09-30T17:17:57.193+0000    done dumping admin.system.users (1 document)
2024-09-30T17:17:57.193+0000    writing admin.system.version to /data/backup/admin/system.version.bson
2024-09-30T17:17:57.193+0000    done dumping admin.system.version (2 documents)
2024-09-30T17:17:57.203+0000    writing myProject.productos to /data/backup/myProject/productos.bson
2024-09-30T17:17:57.203+0000    writing myProject.usuarios to /data/backup/myProject/usuarios.bson
2024-09-30T17:17:57.211+0000    done dumping myProject.productos (20 documents)
2024-09-30T17:17:57.220+0000    done dumping myProject.usuarios (10 documents)

What's next:
    Try Docker Debug for seamless, persistent debugging tools in any container or image → docker debug enviroment0-mongo-1
    Learn more at https://docs.docker.com/go/debug-cli/
PS C:\Users\raule\Desktop\Quinto\dai\enviroment0> docker cp enviroment0-mongo-1:/data/backup ./backup-local
Successfully copied 25.1kB to C:\Users\raule\Desktop\Quinto\dai\enviroment0\backup-local
PS C:\Users\raule\Desktop\Quinto\dai\enviroment0>


restore:
docker cp ./backup-local enviroment0-mongo-1:/data
docker exec -it enviroment0-mongo-1 mongorestore --uri="mongodb://root:example@localhost:27017" --drop /data/backup

*/
