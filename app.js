var expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    mongoose            = require( "mongoose"),
    express             = require("express"),
    app                 = express();

const connectionString = "mongodb://localhost/restful_blog_app";
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
console.log("Database werkend?");
});

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//SCHEMA SETUP

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
    // Title
    // Image
    // Body (content)
    // Created (date)

// MONGOOSE MODEL CONFIG
let Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

// JUST FOR ADDING INITIAL DATA TO DATABASE TO GET IT STARTED, MAKE SURE TO COMMENT IT OUT AFTER USE!!!!!!

// Blog.create(
//     {
//         title: "Test Blog",
//         image: "https://image.shutterstock.com/z/stock-photo-chicago-il-usa-february-a-srt-dodge-viper-car-at-the-chicago-auto-show-cas-on-176128343.jpg",
//         body: "THIS IS A BLOGPOST!"  
//     }, function(err, blog){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED BLOG:");
//             console.log(blog);
//         }
//     });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE- Show all blogs
app.get("/blogs", function(req, res){
    // Get all blogs from DB.
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    // //First part of {blogss: blogs} can be any name you want it to be.
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

// CREATE ROUTE

app.post("/blogs", function(req, res){
    // var title = req.body.blog.title;
    // var image = req.body.blog.image;
    // var blogpost = req.body.blog.blogpost;
    // var newBlog = {title: title, image: image, blogpost: blogpost}
    // Create new blog and save to database.
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // console.log("==============");
    // console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            // console.log(err);
            res.render("new")
        } else {
            //redirect back to the blogs page
            res.redirect("/blogs");
            }
        });
    });

// SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    //find the blog with provided ID
    // res.send("SHOW PAGE");
Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
        res.redirect("/blogs");
    } else {
        res.render("show", {blog: foundBlog});   
    }
});
// req.params.id
// render show template with that blog
// res.render("show");
// res.send("THIS WILL BE THE SHOW PAGE ONE DAY!");
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});   
        }
    });    
});

//     res.render("edit");
// });

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, opdatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
//DESTROY
//REDIRECT
        Blog.findByIdAndRemove(req.params.id, function(err, deleteBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});  


    // res.send("DELETE ARE YOU SURE????");


    








app.listen(3000, function(){
    console.log("The blog server has started!");
    });
