// let url = 'http://54.208.165.234';
let url = 'http://localhost:3000';



let token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;



window.onload = async()=>{
    try{
        let res = await axios.get(`${url}/user/premium/leaderboard/1/pagelimit?limit=${5}`);
        console.log(res);
        loop(res);
    

    }catch(err){
        console.log(err);
    }
};



//Expense page
document.getElementById('show-expense').addEventListener('click',async()=>{
    
    try{
        
       location.href = `${url}/user/premium`;
                    
                       
    }catch(err){
        console.log(err);

    }


});


//file download
document.getElementById('download-file').addEventListener('click',async()=>{
    
    try{
        
        let res = await axios.get(`${url}/download`);
        console.log('res',res);

        let curr_url = res.data;
        location.href = curr_url;    
                       
    }catch(err){
        console.log(err);

    }


});




//downloaded list
document.getElementById('downloaded-files-list').addEventListener('click',async()=>{
    
    try{
        
        location.href = `${url}/premium/downloadlistpage`;
                       
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
        let tbody = document.getElementById('tbody');
        let thead = document.getElementById('thead');
        let div = document.getElementById('pagination');

        tbody.innerHTML = '';
        thead.innerHTML = '';
        div.innerHTML = '';
        try{
            
            if(limit === 0){
                limit = 5;
            }
            let page = curr-1;
            let res = await axios.get(`${url}/user/premium/leaderboard/${page}/pagelimit?limit=${limit}`);
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
        let tbody = document.getElementById('tbody');
        let thead = document.getElementById('thead');
        let div = document.getElementById('pagination');

        tbody.innerHTML = '';
        thead.innerHTML = '';
        div.innerHTML = '';
        try{
            
            if(limit === 0){
                limit = 5;
            }
            let page = curr+1;
            let res = await axios.get(`${url}/user/premium/leaderboard/${page}/pagelimit?limit=${limit}`);
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

    let curr = document.createElement('button');
    let pre = document.createElement('button');
    let nex = document.createElement('button');
    let last = document.createElement('button');
    let text = document.createElement('button');
    let select = document.createElement('select');
    let opt1 = document.createElement('option');
    let opt2 = document.createElement('option');

    text.innerHTML = 'Of';

    curr.innerHTML = currentPage;
    last.innerHTML = lastPage;
    pre.innerHTML = '<< Prev';
    nex.innerHTML = 'Next >>';

    opt1.textContent = '5';
    opt1.value = '5';
    opt2.textContent = '10';
    opt2.value = '10';

    curr.id = 'btn1';
    last.id = 'lastbtn';
    select.id = 'limit';

    curr.className = "page-item page-link";
    pre.className = "page-item page-link";
    nex.className = "page-item page-link";
    last.className = "page-item page-link";
    select.className = "page-item page-link";
    text.className = "page-item page-link";

    pre.addEventListener('click',prev);
    nex.addEventListener('click',next);
    select.addEventListener('click',setPageLimit);

    select.appendChild(opt1);
    select.appendChild(opt2);

    div.appendChild(pre);
    div.appendChild(curr);
    div.appendChild(text);
    div.appendChild(last);
    div.appendChild(nex);
    div.appendChild(select);

}


function loop(res){
    let length = res.data.user.length;
    if(length>0){
            let thead = document.getElementById('thead');

            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            let th3 = document.createElement('th');

            th1.innerHTML = 'S.N';
            th2.innerHTML = 'Name';
            th3.innerHTML = 'Total Expense';

            thead.appendChild(th1);
            thead.appendChild(th2);
            thead.appendChild(th3);

        for(let i = 0;i<length;i++){
            let name = res.data.user[i].name;
            let total_expense = res.data.user[i].total_expense;

            let tr = document.createElement('tr');

            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');

            td1.innerHTML = `${i+1}`;
            td2.innerHTML = `${name}`;
            td3.innerHTML = `${total_expense}`;
            

           
            let tbody = document.getElementById('tbody');
           
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tbody.appendChild(tr);
        };
        let div = document.getElementById('pagination');
        div.style.visibility = 'visible';
        pagination(res);
    }

}