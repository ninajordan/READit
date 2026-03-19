import { getDatabase } from "../../config/db.js";

const WORD_LIST = [
  "Dog",
  "Ant",
  "Bear",
  "Cat",
  "Elephant",
  "Fish",
  "Girraffe",
  "Horse",
  "Iguana",
  "Jackal",
  "Kite",
  "Lion",
  "Monkey",
  "Newt",
  "Orangutan",
  "Parrot",
  "Queen",
  "Rat",
  "Siphon",
  "Tiger",
  "Umbrella",
  "Violin",
  "Watermelon",
  "X-Ray",
  "Yacht",
  "Zebra",
  "Apple",
  "Bog",
  "Crumb",
  "Dalton",
  "Enigma",
  "Frost",
  "Grey",
  "Hunk",
  "Icecream",
  "Joker",
  "Lamp",
  "Muzzle",
  "Null",
  "Opera",
  "Parakeet",
  "Quill",
  "Rabbit",
  "Style",
  "Toad",
  "Umber",
  "Venus",
  "Wolf",
  "Xylem",
  "Yellow",
  "Zero",
];

export function generateAnonymousTag() {
  const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  return `Anonymous ${randomWord}`;
}

export async function getNextUserID() {
  const db = getDatabase();
  const lastUser = await db
    .collection("users")
    .find({})
    .sort({ userID: -1 })
    .limit(1)
    .toArray();

  if (lastUser.length === 0) {
    return "001";
  }

  const lastIdNumber = parseInt(lastUser[0].userID, 10);
  const incrementedId = lastIdNumber + 1;

  return incrementedId.toString().padStart(3, "0");
}

export async function findUserByUsername(username) {
  const db = getDatabase();
  return db.collection("users").findOne({ username });
}

export async function createUser({
  username,
  passwordHash,
  name,
  user_anonymity,
}) {
  const db = getDatabase();
  const userID = await getNextUserID();

  const newUserObject = {
    userID,
    username,
    passwordHash,
    name,
    user_anonymity,
  };

  await db.collection("users").insertOne(newUserObject);
  return newUserObject;
}
