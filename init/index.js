const mongoose = require("mongoose");
const Post = require("../model/post.js");
const User = require("../model/user.js");
const initData = require("./data.js");

// MongoDB URL
const Mongo_URL = "mongodb://127.0.0.1:27017/sparkandscribe";

async function main() {
    await mongoose.connect(Mongo_URL);
    console.log("Connected to DB");
}

// Seed DB
const initDB = async () => {
    await main();

    // -------------------------------
    // STEP 1 → Get any existing user
    // -------------------------------
    let user = await User.findOne();

    // --------------------------------------------------
    // STEP 2 → If no user exists → create a dummy user
    // --------------------------------------------------
    if (!user) {
        console.log("No users found. Creating dummy user...");
        const dummy = new User({
            username: "demoUser",
            email: "demo@example.com",
        });
        const registeredUser = await User.register(dummy, "password123");
        user = registeredUser;
        console.log("Dummy user created:", user._id);
    }

    // -------------------------------
    // STEP 3 → Prepare post data
    // -------------------------------
    const userId = user._id.toString();

    const cleanedPosts = initData.data.map(post => ({
        ...post,
        owner: userId,      // Assign real user ID
        likes: [],          // Add likes array
        comments: []        // Add comments array
    }));

    // -------------------------------
    // STEP 4 → Clear & insert posts
    // -------------------------------
    await Post.deleteMany({});
    await Post.insertMany(cleanedPosts);

    console.log("Post Data Initialized Successfully!");
    process.exit();
};

initDB().catch(err => {
    console.log("ERROR seeding DB:", err);
    process.exit(1);
});
