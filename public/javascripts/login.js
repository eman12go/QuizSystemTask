
let error=document.querySelector("#error")
let form=document.querySelector("form")
form.addEventListener("submit",async(e)=>{
    e.preventDefault();

    error.textContent="";

    const Email=form.Email.value;
    const Password=form.Password.value;
     //console.log(Email,Password)
    
    try{
        let res=await fetch("/login",{
            method:"POST",
            body:JSON.stringify({Email,Password}),
            headers:{"Content-Type":"Application/json"}
        });
        const data=await res.json();
        // console.log(data)
        // console.log(data.message=="success")
        if(data.message.includes("success")){
        
            location.assign("/")
        }else{
            error.textContent=data.message;
        }
    }catch(err){
        // console.log(err);
        res.render("error",err)
    }
})