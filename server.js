const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const router = require("./router");

const app = express();
const port = process.env.PORT || 3000;



// Middleware for parsing request bodies
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));



//load static assets

app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Session middleware
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);



// Prevent caching to disable back button after logout
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma','no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Handle root route (login page)
app.get('/', (req, res) => {
  if (req.session.user) {
      res.redirect('/route/dashboard');
  } else {
      res.render('base', { title: "Login System" });
  }
});

app.use('/route', router);


// home route
app.get("/", (req, res) => {
  res.render("base", { title: "Login System" });
});

// 404 error handling middleware
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(port, () => {
  console.log("Listening to the server on http://localhost:3000");
});
