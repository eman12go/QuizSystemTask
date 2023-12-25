const User=require("./../Models/userSchema");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")

exports.signup=(req,res,next)=>{
   // const logger=new LoggerServices("user.signup")
    // console.log(req.body)
    // steps:
    //1- get data from user & post in db
    // User.findOne({email}).then(user=>{
    //     //user.userpass ,body.userpass .compare
    // })
    let user=new User(req.body);
    user.save().then(data=>{
         console.log(data);
        // res.send("done")
        // token
        let token=jwt.sign({
            Email:req.body.Email,
            role:"user"
        },process.env.SECRT_KEY,{expiresIn:'1hr'});
        res.cookie("jwt",token,{
            httpOnly:true,
            maxAge: 3600*1000  // 1hr
        })
       // logger.info("created new account ",user);
        res.status(201).json({user})
    }).catch(e=>{
        // next(e)
        let message=e.message;
        // message.includes("duplicate key error")
        // ?(message="email already used")
        // : (message="min len for pass 6 char")
       // logger.error(message)
        res.status(400).json({message})
    })
    //duplicate key error
    // 2-token 
}

exports.login=(req,res,next)=>{
    //  if(req.body.Email=="Admin@gmail.com" &&req.body.Password=="Admin"){
    //     let token=jwt.sign({
    //         Email:req.body.Email,
    //         role:"Admin"
    //     },process.env.SECRT_KEY,{expiresIn:'1hr'});
    //     res.cookie("jwt",token,{
    //         httpOnly:true,
    //         maxAge: 3600*1000  // 1hr
    //     })
    //     res.status(200).json({message:"success",token})
    
    //   }
   User.findOne({Email:req.body.Email}).then(data=>{
        // console.log(data);
        bcrypt.compare(req.body.Password,data.Password).then(confirm=>{
           
            if(confirm){

                let token=jwt.sign({
                    Email:req.body.Email,
                    role:"user"
                },process.env.SECRT_KEY,{expiresIn:'1hr'});
                res.cookie("jwt",token,{
                    httpOnly:true,
                    maxAge: 3600*1000  // 1hr
                })
                res.status(200).json({message:"success",token})
            }else{
                let message="pass not valid"
               // logger.error(message,data)
               res.status(400).json({message});
            }
        })
        
    }).catch(e=>{
        // next(e)
        let message="email not valid";
        res.status(400).json({message})
    })
    
}