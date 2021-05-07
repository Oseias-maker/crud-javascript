const productsdb = (dbname, table) => {
    const db = new Dexie(dbname);
    db.version(1).stores(table);
    db.open();

    return db;
};

const bulkcreate = (dbtable, data) => {
    let flag = empty(data);
    if (flag) {
        dbtable.bulkAdd([data]);
        console.log("data inserted successfully...!");
    } else {
        console.log("Por favor, forneça dados..!");
    }
    return flag;
};

// criando elementos dinâmicos
const createEle = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
};

// checando a validação da caixa de texto
const empty = object => {
    let flag = false;
    for (const value in object) {
        if (object[value] != "" && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
        }
    }
    return flag;
};

// getData direto do database
const getData = (dbname, fn) => {
    let index = 0;
    let obj = {};
    dbname.count(count => {
        // contando as linhas da tabela usando um método de conta
        if (count) {
            dbname.each(table => {
                // tabela => retornando um objeto data da tabela
                // para organizar a ordem vamos criar um looping
                obj = SortObj(table);
                fn(obj, index++); // chamando uma função com um argumento data 
            });
        } else {
            fn(0);
        }
    });
};

const SortObj = (sortobj) => {
    let obj = {};
    obj = {
        id: sortobj.id,
        name: sortobj.name,
        seller: sortobj.seller,
        price: sortobj.price
    };
    return obj;
}


export default productsdb;
export {
    bulkcreate,
    createEle,
    getData,
    SortObj
};
