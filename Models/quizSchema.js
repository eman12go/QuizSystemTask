const mongoose=require("mongoose");


const optionSchema = new mongoose.Schema({
    option: {
      type: String,
      required: true
    }
  });
  
  const questionSchema = new mongoose.Schema({
      question: {
          type: String,
          required: true
      },
      answers: [optionSchema],
  
      answer: {
        type: Number,
        required: true
      },
  
      isEnabled: {
          type: Boolean,
          default: true
      },
  
      explanation:{
        type: String,
        default: ""
      }
  
  }, {
      timestamps: true
  });
  const quizSchema=new mongoose.Schema({
    Title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    questions: [questionSchema],
    isEnabled: {
        type: Boolean,
        default: true
    },
    duration :{
      hours : {
        type : Number,
        default: 0
      },

      minutes : {
        type : Number,
        default: 0
      },

      seconds : {
        type : Number,
        default: 0
      }
    }

})
  var Quizes = mongoose.model('Quiz', quizSchema);

module.exports = Quizes;