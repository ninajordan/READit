import { connectToDatabase, closeConnection } from "./db.js";

async function setupDatabase() {
  console.log("setting up READit Database");

  try {
    const db = await connectToDatabase();
    const collections = ["users", "channels", "posts", "likes", "comments"];

    for (const colName of collections) {
      const existingCollections = await db
        .listCollections({ name: colName })
        .toArray();
      if (existingCollections.length > 0) {
        console.log(`Collection ${colName} already exists`);
      } else {
        await db.createCollection(colName);
        console.log(`${colName} did not exist. Created!`);
      }
    }

    console.log("Creating Indices");
    await db.collection("users").createIndex({ userID: 1 }, { unique: true });
    await db
      .collection("channels")
      .createIndex({ channelID: 1 }, { unique: true });
    await db.collection("posts").createIndex({ postID: 1 }, { unique: true });
    await db.collection("posts").createIndex({ numLikes: -1 });
    await db.collection("likes").createIndex({ likeID: 1 }, { unique: true });
    await db
      .collection("comments")
      .createIndex({ commentID: 1 }, { unique: true });
    await db.collection("comments").createIndex({ numLikes: -1 });
  } catch (error) {
    console.error(`Error in setting up the database: ${error}`);
    throw error;
  } finally {
    await closeConnection();
  }
}

setupDatabase();
