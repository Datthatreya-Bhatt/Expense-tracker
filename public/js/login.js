// let url = 'http://54.208.165.234';
let url = 'http://localhost:3000';


document.getElementById('button').addEventListener('click',async()=>{
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    try{
        let res = await axios.post(`${url}/login`,{
            email: email,
            password: password
        })
        console.log(res,res.data.data);
            
        if(res.data === 'incorrect'){
            alert('Email or Password is incorrect');
        }else if(res.status === 201){
            localStorage.setItem('token',res.data.token);
            

            let token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] =`${token}`;
            
            
           if(res.data.ispremium){
            
                location.href = `${url}/premium`;
           }else{
            
                location.href = `${url}/expense`;
           }
            

        }
        else{
            alert('status not found');
            console.log(res);
        }

    }catch(err){
        console.log(err);
    };
});






document.getElementById('forgot').addEventListener('click',async()=>{
    
    location.href =  `${url}/forgotpassword`;



});
