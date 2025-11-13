require("dotenv").config();

// server.js
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MongoStore=require("connect-mongo")

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./model/user");
const PostRouter = require("./routers/postRouter");
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl)
}
// ----------------------
// DB CONNECTION
// ----------------------
// mongoose.connect("mongodb://127.0.0.1:27017/sparkandscribe")
main()
    .then(() => console.log("Connected to Database"))
    .catch(err => console.log(err));
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
// ----------------------
// VIEW ENGINE + MIDDLEWARE
// ----------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// ----------------------
// SESSION + FLASH
// ----------------------
const sessionConfig = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

// ----------------------
// PASSPORT
// ----------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----------------------
// FLASH + USER AVAILABLE IN ALL EJS PAGES
// ----------------------
app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ----------------------
// ROUTES
// ----------------------
app.use("/blogs", PostRouter);

// ----------------------
// SERVER START
// ----------------------
app.listen(2614, () => {
    console.log("Server running on port 2614");
});
