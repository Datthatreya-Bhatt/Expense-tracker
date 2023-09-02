let token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;

// let url = 'http://54.208.165.234';
let url = 'http://localhost:3000';



window.onload = async()=>{
    try{
        let res = await axios.get(`${url}/expense/data/1/pagelimit?limit=${5}`);
        console.log(res);
        loop(res);
        
    }catch(err){
        console.log(err);
    }
};








document.getElementById('button').addEventListener('click',async()=>{
    let amount = document.getElementById('amount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    console.log(amount,description,category);
    try{
            await axios.post(`${url}/expense/data`,{
            amount: amount,
            description: description,
            category: category
        });

        location.reload();
    }catch(err){
        console.log(err);
    }
});
document.getElementById('purchase').addEventListener('click',async()=>{
    try{
        
        let res = await axios.get(`${url}/purchasepremium`);
        console.log('res',res);
        let options ={
            "key": res.data.key,
            "order_id": res.data.id,
            "handler": async(res)=>{
                try{   
                    
                        await axios.post(`${url}/success/purchase`,{
                            res:res 
                        })

                        location.href = `${url}/user/premium`;

                    }catch(err){
                        console.log(err);
                    }              
            }
        }
        const rzpl = new Razorpay(options);
        rzpl.open();

        rzpl.on('payment.failed',async(res)=>{
            try{   
                    
                await axios.post(`${url}/failed/purchase`,{
                   res:res
                })

            }catch(err){
                console.log(err);
            }
            alert('transaction failed please retry after some time');
            console.log(res.error);
        })
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
            let res = await axios.get(`${url}/expense/data/${page}/pagelimit?limit=${limit}`);
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
            let res = await axios.get(`${url}/expense/data/${page}/pagelimit?limit=${limit}`);
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
            let th4 = document.createElement('th');
            let th5 = document.createElement('th');

            th1.innerHTML = 'S.N';
            th2.innerHTML = 'Amount';
            th3.innerHTML = 'Description';
            th4.innerHTML = 'Category';
            th5.innerHTML = 'Delete';

            thead.appendChild(th1);
            thead.appendChild(th2);
            thead.appendChild(th3);
            thead.appendChild(th4);
            thead.appendChild(th5);

        for(let i = 0;i<length;i++){
            let id = res.data.user[i]._id;
            let amount = res.data.user[i].amount;
            let description = res.data.user[i].description;
            let category = res.data.user[i].category;

            let tr = document.createElement('tr');

            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            let td5 = document.createElement('td');

            td1.innerHTML = `${i+1}`;
            td2.innerHTML = `${amount}`;
            td3.innerHTML = `${description}`;
            td4.innerHTML = `${category}`;
            

            let btn = document.createElement('button');
            btn.innerText = 'Delete Item';
            btn.className = 'btn btn-primary btn-sm';
            btn.addEventListener('click',async()=>{
                try{
                    let res = await axios.delete(`${url}/expense/${id}`)
                    td5.parentNode.removeChild(td5);
                    location.reload();
                }catch(err){
                    console.log(err);
                }
            });

            td5.appendChild(btn);
            let tbody = document.getElementById('tbody');
           
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            tbody.appendChild(tr);
        };
        let div = document.getElementById('pagination');
        div.style.visibility = 'visible';
        pagination(res);
    }

}