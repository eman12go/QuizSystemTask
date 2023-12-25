
let error=document.querySelector("#error")
let form=document.querySelector("form")
form.addEventListener("submit",async(e)=>{
    e.preventDefault();

    error.textContent="";

    const Email=form.Email.value;
    const Password=form.Password.value;
    const cpassword=form.cpassword.value;
    const Username=form.Username.value;
    console.log(Email,Password);
    console.log(cpassword,Username);
    if(cpassword==Password){

        try{
            let res=await fetch("/signup",{
                method:"POST",
                body:JSON.stringify({Username,Email,Password}),
                headers:{"Content-Type":"Application/json"}
            });
            const data=await res.json();
            console.log(data);
            if(data.user){
                location.assign("/")
            }else{
                error.textContent=data.message;
            }
        }catch(err){
            // console.log(err);
            res.render("error",err)
        }
    }else{
        const data=await res.json();
        error.textContent=data.message;
        
    }
})