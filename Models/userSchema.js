const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const quizSchema=require("./quizSchema");

const questionResults = new mongoose.Schema({
    question: {
        type: String    
    },
    answer: {
        type: Number    
    },
});
const quizResults = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'    
    },
    answers:[questionResults],
    score:{
        type:Number,
        default:0
    }
  });
  
const schema=new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        minlength:[6,"password shold be more than 6 char"]
    },
    quizes: [quizResults]
})


schema.pre("save",async function(next){
    const salt=await bcrypt.genSalt();
     console.log(salt)
    this.Password = await bcrypt.hash(this.Password,salt)
    next();
})
schema.post("save",(document,next)=>{
    console.log("created");
    next();
})
module.exports=mongoose.model("users",schema);