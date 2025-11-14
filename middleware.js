    const Post = require("./model/post");
    const multer = require("multer");

    // Store images in /uploads folder
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        }
    });

    module.exports.upload = multer({ storage });


    module.exports.isLoggedIn = (req, res, next) => {
      if (!req.isAuthenticated()) {
        console.log(req.originalUrl._id);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/blogs/login");
      }
      next();
    };

    module.exports.saveRedirectUrl = (req, res, next) => {
      if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
      }
      next();
    };

    module.exports.isOwner = async (req, res, next) => {
      const post = await Post.findById(req.params.id);

      if (!post.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/blogs/${req.params.id}`);
      }
      next();
    };

    module.exports.validatePost = (req, res, next) => {
      // OPTIONAL (if you use Joi schema)
      next();
    };
