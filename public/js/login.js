document.getElementById('button').addEventListener('click',async()=>{
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    try{
        let res = await axios.post('http://localhost:3000/user/login',{
            email: email,
            password: password
        })
            
        if(res.data === 'incorrect'){
            alert('Email or Password is incorrect');
        }else if(res.status === 201){
            localStorage.setItem('token',res.data);
            

            let token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] =`${token}`;
            
          
            location.href = 'http://localhost:3000/expense';
            

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
    
    location.href =  'http://localhost:3000/forgotpassword';



});
