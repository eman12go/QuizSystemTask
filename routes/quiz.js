const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authCheck = require('../Midlware/authMW');

const Quizes = require("./../Models/quizSchema");
const Users = require("./../Models/userSchema");

const quizRouter = express.Router();
quizRouter.use(bodyParser.json());

quizRouter.route('/')
    .get(authCheck,(req, res, next) => {
       Quizes.find({isEnabled : true})
            .then((quizes) => {
                console.log(quizes);
              res.render("quiz",{quizes})

                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'text/plain');
                // var text = "";
                // for (var i = 0; i < quizes.length; i++)
                //    text = text + "<b>Name: </b>" + quizes[i].Title + "<br>" + "<b>id:</b> " + quizes[i]._id + "<br><hr>";
                // res.end(text);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authCheck, (req, res, next) => {
        Quizes.create(req.body)
            .then((quiz) => {
              console.log('Quiz Created: ', quiz);
              res.redirect("/quizes")

            }, (err) => next(err)).catch((err) => next(err));
    })
    .put(authCheck,(req, res, next) => {
        res.statusCode = 403 /*Not supported*/
        res.end('PUT operation not supported on /quizes');
    })


quizRouter.get('/createquiz',authCheck,async function(req, res, next) {
        
        res.render("createQuiz")
        })

quizRouter.route('/:quizId',authCheck)
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                console.log(quiz)
                res.send(quiz)
               // res.render("quizdetails",{quiz})
               
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'text/plain');
                // var html = "<p style = 'text-align: center'><b>" + quiz.Title + "</b></p><b>description: </b>" + quiz.description + "<br>";
                // html = html + "<b>Duration: </b>" + quiz.duration.hours + ":" + quiz.duration.minutes + ":" + quiz.duration.seconds + "<hr>";
                // var num = 1;
                // for (var i = 0; i < quiz.questions.length; i++) {
                //   if (!quiz.questions[i].isEnabled)
                //       continue;
                //   html = html + num + ". " + quiz.questions[i].question + "  -  " + quiz.questions[i]._id + "<br><div style = 'margin: 10px'>";
                //   num = num + 1;
                //   for (var j = 0; j < quiz.questions[i].answers.length; j++) {
                //     html = html + (j+1) + ". " + quiz.questions[i].answers[j].option + "<br>";
                //   }
                //   html = html + "</div><b> Answer: </b>" + quiz.questions[i].answer + "<br><b>Explanation: </b>" + quiz.questions[i].explanation + "<br><hr>";
                // }
                // res.end(html);
            }, (err) => next(err)).catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403 /*Not supported*/
        res.end('POST operation not supported on /quizes/'
            + req.params.quizId);
    })
    .put(authCheck, (req, res, next) => {
        Quizes.findByIdAndUpdate(req.params.quizId, {
            $set: req.body
        }, { new: true })
            .then((quiz) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(quiz);
            }, (err) => next(err)).catch((err) => next(err));
    })
    .delete(/*authenticate.verifyUser,*/  (req, res, next) => {
    console.log("delete..............."+ req.params.quizId)
        Quizes.findByIdAndDelete( req.params.quizId)
            .then((quiz) => {
                console.log(quiz);
                res.send("secussss")
             //   res.redirect("/quizes");
                
            }, (err) => next(err)).catch((err) => next(err));
    });
   
     
/*___________________________________________________*/
/*___________________________________________________*/
/*___________________________________________________*/


quizRouter.route('/:quizId/questions',authCheck)
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null) {
                res.render("takequiz",{quiz})

                    // res.statusCode = 200;
                    // res.setHeader('Content-Type', 'application/json');
                    // res.json(quiz.questions);
                }
                else {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .post(/*authenticate.verifyUser,*/  (req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null) {
                    quiz.questions.push(req.body);
                    quiz.save()
                        .then((quiz) => {
                            Quizes.findById(quiz._id)
                                .then((quiz) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(quiz);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403 /*Not supported*/
        res.end('PUT operation not supported on /quizes'
            + req.params.quizId + '/questions');
    })
    .delete(/*authenticate.verifyUser,*/  (req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null) {
                    for (var i = (quiz.questions.length - 1); i >= 0; i--) {
                        quiz.questions.id(quiz.questions[i]._id).remove();
                    }
                    quiz.save()
                        .then((quiz) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(quiz.questions);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    });


quizRouter.route('/:quizId/questions/:questionId',authCheck)
    .get((req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null && quiz.questions.id(req.params.questionId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(quiz.questions.id(req.params.questionId));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403 /*Not supported*/
        res.end('POST operation not supported on /quizes/'
            + req.params.quizId + '/questions' + req.params.questionId);
    })
    .put(/*authenticate.verifyUser,*/ (req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {

                if (quiz != null && quiz.questions.id(req.params.questionId) != null) {
                    if (req.body.question) {
                        quiz.questions.id(req.params.questionId).question = req.body.question;
                    }
                    if (req.body.answers) {
                        quiz.questions.id(req.params.questionId).answers = req.body.answers;
                    }
                    if (req.body.answer) {
                        quiz.questions.id(req.params.questionId).answer = req.body.answer;
                    }
                    if (req.body.isEnabled != null) {
                        quiz.questions.id(req.params.questionId).isEnabled = req.body.isEnabled;
                    }
                    quiz.save()
                        .then((quiz) => {
                            Quizes.findById(quiz._id)
                                .then((quiz) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(quiz.questions.id(req.params.questionId));
                                })
                        }, (err) => next(err));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .delete(/*authenticate.verifyUser,*/  (req, res, next) => {
        Quizes.findById(req.params.quizId)
            .then((quiz) => {
                if (quiz != null && quiz.questions.id(req.params.questionId) != null) {
                    quiz.questions.id(req.params.questionId).remove();
                    quiz.save()
                        .then((quiz) => {
                            Quizes.findById(quiz._id)
                                .then((quiz) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(quiz);
                                })
                        }, (err) => next(err));
                }
                else if (quiz == null) {
                    err = new Error('Quiz ' + req.params.quizId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    });




// Start and complete a quiz
quizRouter.post('/:quizId/complete',authCheck, (req, res,next) => {
    const quizId  = req.params.quizId;
    const  answers  = req.body.answers;
 console.log(quizId);
    // Validate input
    if (!quizId || !answers || answers.length === 0) {
      return res.status(400).json({ error: 'Invalid request.' });
    }
  
    // Find the quiz by ID
    const quiz =  Quizes.findById(req.params.quizId)
    .then((quiz) => {
       // console.log(quiz);
        Users.findById(req.body.user._id).then((user)=>{

           // console.log(user);
            const result = { quizId, answers };
            user.quizes.push(result);
            res.json({ message: 'Quiz completed successfully.' });
        })

       
    // Check if the quiz exists
    }).catch((err) => next(err));
   
    
});
   
  

module.exports = quizRouter;

