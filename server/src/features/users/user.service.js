import { getDatabase } from "../../config/db.js";

function selectRandomWord() {
    const word_list = ["Dog", "Ant", "Bear", "Cat", "Elephant", "Fish", "Girraffe", "Horse", "Iguana", "Jackal", "Kite", "Lion", "Monkey", "Newt", "Orangutan", "Parrot",
        "Queen", "Rat", "Siphon", "Tiger", "Umbrella", "Violin", "Watermelon", "X-Ray", "Yacht", "Zebra", "Apple", "Bog", "Crumb", "Dalton", "Enigma", "Frost", "Grey", "Hunk",
        "Icecream", "Joker", "Lamp", "Muzzle", "Null", "Opera", "Parakeet", "Quill", "Rabbit", "Style", "Toad", "Umber", "Venus", "Wolf", "Xylem", "Yellow", "Zero"
    ];

    const random_word = word_list[Math.floor(Math.random() * word_list.length)];
    return random_word;
}

async function getNextUserID() {
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

export async function newUser(name) {
    try {
        const db = getDatabase();
        const nextId = await getNextUserID();

        const randomness = selectRandomWord();
        const user_anonymity = `Anonymous ${randomness}`;

        const newUserObject = {
            userID: nextId,
            name: name,
            user_anonymoty: user_anonymity,
        };

        await db.collection("users").insertOne(newUserObject);
        return newUserObject;
    } catch (error) {
        console.log("[USER SERVICE ERROR] Failed to create User");
        return {
            "error": error,
            "status":500,
        }
    }
}