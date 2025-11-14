const Post = require("../model/post");
const User = require("../model/user");
const ExpressError = require("../views/utils/ExpressError");



// HOME PAGE
module.exports.home = async (req, res) => {
  const allPost = await Post.find({});
  res.render("home.ejs", { allPost });
};

// ABOUT PAGE
module.exports.about = (req, res) => {
  res.render("about.ejs");
};

// SHOW CREATE FORM
module.exports.createForm = (req, res) => {
  res.render("create.ejs");
};

module.exports.createBlog = async (req, res) => {
  let url = "";
  let filename = "";

  if (req.file) {
    url = req.file.path;
    filename = req.file.filename;
  }

  const newPost = new Post(req.body.blog);
  newPost.owner = req.user._id;
  newPost.image = { url, filename };

  await newPost.save();
  req.flash("success", "New Blog Created!");
  res.redirect("/blogs");
};
  

//FILTER ROUTE
module.exports.filterByCategory = async (req, res) => {
    const category = req.params.category;

    const posts = await Post.find({ category });

    res.render("filtered.ejs", { category, posts });
};

// SHOW BLOG
module.exports.showBlog = async (req, res) => {
  const blog = await Post.findById(req.params.id)
    .populate("owner")
    .populate("comments.author");

  if (!blog) {
    req.flash("error", "Post not found");
    return res.redirect("/blogs");
  }

  res.render("show.ejs", { blog });
};

// EDIT BLOG FORM
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const blog = await Post.findById(id);

    if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/blogs");
    }

    res.render("edit.ejs", { blog });
};


// UPDATE BLOG
module.exports.update = async (req, res) => {
    const { id } = req.params;

    if (!req.body.blog) {
        throw new ExpressError("Invalid blog data", 400);
    }

    await Post.findByIdAndUpdate(id, req.body.blog);

    req.flash("success", "Blog updated successfully!");
    res.redirect(`/blogs/show/${id}`);
};


// DELETE BLOG
module.exports.delete = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  req.flash("success", "Post deleted!");
  res.redirect("/blogs");
};

// ADD COMMENT
module.exports.addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    content: req.body.comment.content,
    author: req.user._id
  });

  await post.save();
  req.flash("success", "Comment added!");
  res.redirect(`/blogs/show/${req.params.id}`);
};

// LIKE / UNLIKE POST
module.exports.likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    // If user already liked → remove like
    if (post.likes.includes(userId)) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();
    res.redirect(`/blogs/show/${req.params.id}`);
};


// LOGIN
module.exports.loginForm = (req, res) => res.render("login.ejs");

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/blogs");
};

// SIGNUP
module.exports.signupForm = (req, res) => res.render("signup.ejs");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email });
    await User.register(user, password);

    req.flash("success", "Signup successful!");
    res.redirect("/blogs/login");

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/blogs/signup");
  }
};

// LOGOUT
module.exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out!");
    res.redirect("/blogs/login");
  });
};

