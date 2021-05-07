import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
} from "./Module.js";


let db = prodb("Productdb", {
    products: `++id, name, seller, price`
});

// adicionar tags
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

// butões criados
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// user data

// evento listerner para criação dos botões
btncreate.onclick = event => {
    // insert values
    let flag = bulkcreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value
    });
    // reset textbox values
    //proname.value = "";
    //seller.value = "";
    // price.value = "";
    proname.value = seller.value = price.value = "";

    // set id textbox value
    getData(db.products, data => {
        userid.value = data.id + 1 || 1;
    });
    table();

    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
};

// evento listerner para criação dos botões
btnread.onclick = table;

// atualização dos botões
btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
        // call dexie update method
        db.products.update(id, {
            name: proname.value,
            seller: seller.value,
            price: price.value
        }).then((updated) => {
            // let get = updated ? `data updated` : `couldn't update data`;
            let get = updated ? true : false;

            // display de menssagem
            let updatemsg = document.querySelector(".updatemsg");
            getMsg(get, updatemsg);

            proname.value = seller.value = price.value = "";
            //console.log(get);
        })
    } else {
        console.log(`Por favor, insira o id: ${id}`);
    }
}

// botão de deletar
btndelete.onclick = () => {
    db.delete();
    db = prodb("Productdb", {
        products: `++id, name, seller, price`
    });
    db.open();
    table();
    textID(userid);
    // display de menssagem
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
}

window.onload = event => {
    // seleção de valor para o ID
    textID(userid);
};




// criação da tabela dinâmica
function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remoção de todos os childs do primeiro dom 
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }


    getData(db.products, (data, index) => {
        if (data) {
            createEle("tr", tbody, tr => {
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data.price === data[value] ? `R$ ${data[value]}` : data[value];
                    });
                }
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute(`data-id`, data.id);
                        // loja de números de edição dos botões
                        i.onclick = editbtn;
                    });
                })
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`, data.id);
                        // loja de números de edição dos botões
                        i.onclick = deletebtn;
                    });
                })
            });
        } else {
            notfound.textContent = "Nenhum registro encontrado no banco de dados...! ";
        }

    });
}

const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, function (data) {
        let newdata = SortObj(data);
        userid.value = newdata.id || 0;
        proname.value = newdata.name || "";
        seller.value = newdata.seller || "";
        price.value = newdata.price || "";
    });
}

// deletar ícone removendo um elemento
const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
}

// caixa de texto id
function textID(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}

// função da menssagem
function getMsg(flag, element) {
    if (flag) {
        // chamando a menssagem 
        element.className += " movedown";

        setTimeout(() => {
            element.classList.forEach(classname => {
                classname == "movedown" ? undefined : element.classList.remove('movedown');
            })
        }, 4000);
    }
}