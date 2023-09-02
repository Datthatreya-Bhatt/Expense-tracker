// let url = 'http://54.208.165.234';
let url = 'http://localhost:3000';


document.getElementById('button').addEventListener('click',async(e)=>{
    e.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    console.log(name, email, password)
    
    try{
        let res = await axios.post(`${url}/signup`,{
        name: name,
        email: email,
        password: password
    });


console.log(res);

    if(res.data === 'fail'){
        alert('user already exists');
    }
    else if(res.data === 'length'){
        alert('write proper name,email and password');
    }
    else if (res.data === 'success'){
        alert('account created');
        location.href = `${url}/login`;
    }
    
    }catch(err){
        console.log(err);


    }

})