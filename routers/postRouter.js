const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controllers/post");
const { isLoggedIn, isOwner, validatePost } = require("../middleware");
const multer  = require('multer')
const {storage}= require("../cloudConfig")
const upload = multer({storage});



// PUBLIC ROUTES
router.get("/", postController.home);
router.get("/about", postController.about);

// AUTH
router.get("/login", postController.loginForm);
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/blogs/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/blogs");
    }
);
router.get("/signup", postController.signupForm);
router.post("/signup", postController.signup);

router.get("/logout", postController.logout);

// CREATE BLOG
router.get("/create", isLoggedIn, postController.createForm);
router.post("/create", isLoggedIn, upload.single("blog[image]"),validatePost, postController.createBlog);

// COMMENTS
router.post("/:id/comments", isLoggedIn, postController.addComment);


// LIKE ROUTE
router.post("/:id/like", isLoggedIn, postController.likePost);


// EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, postController.edit);

// UPDATE BLOG PUT
router.put("/:id", isLoggedIn, isOwner, validatePost, postController.update);
//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, postController.delete);
//FILTER ROUTE
router.get("/category/:category", postController.filterByCategory);

// SHOW BLOG PAGE
router.get("/show/:id", postController.showBlog);



module.exports = router;
