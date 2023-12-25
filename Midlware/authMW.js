const jwt=require("jsonwebtoken");

const authCheck = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.SECRT_KEY, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/");
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect("/login");
    //   res.redirect("/signup");
    // res.render('login')
    }
  };
  
  module.exports = authCheck;