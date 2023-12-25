var express = require('express');
var router = express.Router();
const signController=require('./../Controllers/signController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.route('/signup')
.get( function(req, res, next) {
  // res.send("trggff")
  res.render('signup');
})
.post(signController.signup);


router.get("/login",(req,res,next)=>{
  // res.send("login page");
  res.render("login")
})
.post("/login",signController.login)

router.get("/logout",(req,res,next)=>{
  // res.send("login page");
  // res.clearCookie()
  res.cookie("jwt","",{
      httpOnly:true,
      maxAge:1
  });
  res.redirect("/login")
})
  // View user quiz history (completed quizzes)
  // app.get('/user/:userId/quizzes', (req, res) => {
  //   const { userId } = req.params;
  
  //   // Find the user's quiz results
  //   const userResults = quizResults.filter(result => result.userId === userId);
  
  //   res.json(userResults);
  // });
  
module.exports = router;
