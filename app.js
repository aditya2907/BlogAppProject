//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
}
const Post = mongoose.model("Post", postSchema);

const contactSchema = {
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	},
	decription: {
		type: String,
		required: true
	}
}

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", function (req, res) {
	Post.find({}, function (err, posts) {
		res.render("home", {
			startingContent: homeStartingContent,
			posts: posts
		});
	});
});

app.get("/about", function (req, res) {
	res.render("about", {
		aboutContent: aboutContent
	})
});

app.route("/contact")
.get(function (req, res) {
	res.render("contact");
})
.post(function(req, res){
	const contact = new Contact({
		name: req.body.contactName,
		email: req.body.contactEmail,
		phone: req.body.contactPhone,
		decription: req.body.contactDescription
	});
	contact.save(function (err) {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.route("/compose")
.get(function (req, res) {
	res.render("compose")
})
.post(function (req, res) {
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody
	});
	post.save(function (err) {
		if (!err) {
			res.redirect("/");
		}
	});
});


app.get("/posts/:postId", function (req, res) {
	
	const requestedPostId = req.params.postId;

	Post.findOne({ _id: requestedPostId }, function (err, posts) {
	  res.render("post", {
		title: posts.title,
		content: posts.content
		});
	});
});


app.listen(3000, function () {
	console.log("Server started on port 3000");
});
