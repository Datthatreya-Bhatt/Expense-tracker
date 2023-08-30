
let token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;



window.onload = async()=>{
    try{
        let res = await axios.get(`http://localhost:3000/expense/data/1/pagelimit?limit=${5}`);
        console.log(res);
        loop(res);
    

    }catch(err){
        console.log(err);
    }
};

//form submit
document.getElementById('button').addEventListener('click',async()=>{
    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    console.log(amount,description,category);
    try{
            await axios.post(`http://localhost:3000/expense/data`,{
            amount: amount,
            description: description,
            category: category
        });

        location.reload();
    }catch(err){
        console.log(err);
    }
});


//leaderBoard
document.getElementById('btn').addEventListener('click',async()=>{
    
    try{
        
        let res = await axios.get('http://localhost:3000/user/premium/leaderboard');
        console.log('res',res);


        let h = document.createElement('h3');
        h.innerHTML = 'LEADER BOARD';

        let div = document.getElementById('leaderboard');
        div.appendChild(h);

        
        let length = res.data.length;
        for(let i = 0;i<length;i++){
            let li = document.createElement('li');
            li.innerHTML = `Name-${res.data[i].name}-Total Expense-${res.data[i].total_expense}`;
            div.appendChild(li);
        }
                    
                       
    }catch(err){
        console.log(err);

    }


});

//file download

document.getElementById('btn2').addEventListener('click',async()=>{
    
    try{
        
        let res = await axios.get('http://localhost:3000/download');
        console.log('res',res);

        let url = res.data;
        location.href = url;    
                       
    }catch(err){
        console.log(err);

    }


});



//downloaded list

document.getElementById('btn3').addEventListener('click',async()=>{
    
    try{
        
        let res = await axios.get('http://localhost:3000/download/list');
        console.log('res',res);
        
        let div = document.getElementById('downlodedList');

        let length = res.data.length;
        let h3 = document.createElement('h3');
        h3.innerHTML = 'Downloaded Files List';
        div.appendChild(h3);
        for(let i =0;i<length;i++){
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.innerHTML = `Expense-${i}`;
            a.href = res.data[i].links;
            li.appendChild(a);
            div.appendChild(li);
        } 
       
                       
    }catch(err){
        console.log(err);

    }


});


function setPageLimit(){
    let limit = document.getElementById('limit').value;
    localStorage.setItem('limit',`${limit}`);
}


async function prev(){
    let curr = document.getElementById('btn1').innerHTML;
    curr = Number(curr);
    
    let limit = Number(localStorage.getItem('limit'));

    if(curr>1){
        let list = document.getElementById('list');
        let div = document.getElementById('pagination');
        list.innerHTML = '';
        div.innerHTML = '';

        try{
           
            if(limit === 0){
                limit = 5;
            }
            let page = curr-1;
            let res = await axios.get(`http://localhost:3000/expense/data/${page}/pagelimit?limit=${limit}`);
           // pagination(res);
            loop(res);

        }catch(err){
            console.log(err);
        }
    }
}

async function next(){
    let curr = document.getElementById('btn1').innerHTML;
    let max = document.getElementById('lastbtn').innerHTML;
    
    let limit = Number(localStorage.getItem('limit'));
    
    curr = Number(curr);
    max = Number(max);

    if(curr < max){
        let list = document.getElementById('list');
        let div = document.getElementById('pagination');
        list.innerHTML = '';
        div.innerHTML = '';
        try{
            
            if(limit === 0){
                limit = 5;
            }
            let page = curr+1;
            let res = await axios.get(`http://localhost:3000/expense/data/${page}/pagelimit?limit=${limit}`);
            //pagination(res);
            loop(res);
            

        }catch(err){
            console.log(err);
        }
    }
}

function pagination(res){
    let currentPage = res.data.obj.page;
    let lastPage = res.data.obj.count;

    let div = document.getElementById('pagination');

    let p = document.createElement('p');
    let curr = document.createElement('button');
    let pre = document.createElement('button');
    let nex = document.createElement('button');
    let last = document.createElement('button');
    let text = document.createTextNode('of');
    let select = document.createElement('select');
    let opt1 = document.createElement('option');
    let opt2 = document.createElement('option');

    curr.innerHTML = currentPage;
    last.innerHTML = lastPage;
    pre.innerHTML = 'Prev';
    nex.innerHTML = 'Next';

    opt1.textContent = '5';
    opt1.value = '5';
    opt2.textContent = '10';
    opt2.value = '10';

    curr.id = 'btn1';
    last.id = 'lastbtn';
    select.id = 'limit';

    pre.addEventListener('click',prev);
    nex.addEventListener('click',next);
    select.addEventListener('click',setPageLimit);

    select.appendChild(opt1);
    select.appendChild(opt2);

    p.appendChild(pre);
    p.appendChild(curr);
    p.appendChild(text);
    p.appendChild(last);
    p.appendChild(select);
    p.appendChild(nex);

    div.appendChild(p);
}


function loop(res){
    let length = res.data.user.length;
    if(length>0){

        for(let i = 0;i<length;i++){
            let id = res.data.user[i].id;
            let amount = res.data.user[i].amount;
            let description = res.data.user[i].description;
            let category = res.data.user[i].category;

            let li = document.createElement('li');
            li.innerHTML = `${amount}-${description}-${category}`;

            let btn = document.createElement('button');
            btn.innerText = 'Delete Item';
            btn.addEventListener('click',async()=>{
                try{
                    let res = await axios.delete(`http://localhost:3000/expense/${id}`)
                    li.parentNode.removeChild(li);
                    location.reload();
                }catch(err){
                    console.log(err);
                }
            });

            li.appendChild(btn);
            let list = document.getElementById('list');
            list.appendChild(li);
        };
        let div = document.getElementById('pagination');
        div.style.visibility = 'visible';
        pagination(res);
    }

}