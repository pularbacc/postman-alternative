
const key = {
    inpMethod: "inp-method",
    inpUrl: "inp-url",
    inpBody: "inp-body",
    output: "output",
    typeOutPut: "type-output",

    tabContainer: "tab-container",
    tabAdd: "tab-add"
}

const inpMethod = document.getElementById(key.inpMethod);
const inpUrl = document.getElementById(key.inpUrl);
const inpBody = document.getElementById(key.inpBody);

const output = document.getElementById(key.output);
const typeOutPut = document.getElementById(key.typeOutPut);

function clearOutPut() {
    output.innerText = "";
    typeOutPut.innerText = "";
    output.classList.remove("outout-text--error");
}

function printOutPut(res, typeRes) {  // res --> object, text, error-> error json , error text
    switch (typeRes) {
        case "OBJECT":
            output.value = JSON.stringify(res);
            //typeOutPut.innerText = "(object)";
            break;
        case "TEXT":
            output.value = res;
            //typeOutPut.innerText = "(text)";
            break;
        case "ERROR_OBJECT":
            break;
        case "ERROR_TEXT":
            output.value = res;
            //output.classList.add("outout-text--error");
            //typeOutPut.innerText = "(error)";
            break;
    }

    if(tabCurrent){
        tabCurrent.output = output.value;
    }
}

async function send() {
    clearOutPut();
    const url = inpUrl.value;
    const method = inpMethod.value;
    let body = null;
    if (inpBody.value && method != "GET") {
        body = JSON.parse(inpBody.value);
        body = JSON.stringify(body);
    }

    console.log(body);
    try {
        await fetch(url, {
            method: method,
            headers: { 'content-type': 'application/json' },
            body: body
        }
        ).then(async res => {
            switch (res.headers.get("content-type")) {
                case "application/json; charset=utf-8":
                    printOutPut(await res.json(), "OBJECT");
                    break;
                case "text/html; charset=UTF-8":
                    printOutPut(await res.text(), "TEXT");
                    break;
            }
        }).catch(e => {
            console.log(e);
            printOutPut(e, "ERROR_TEXT");
        })
    } catch (e) {
        console.log(e);
    }
}

/*
tabData = {
            method: "GET",
            url: "",
            id: Date.now(),
            tabElm: tabElm,

            output
        }
<div class="tab">
    <div class="tab-method">GET</div>
    <div class="tab-name">http://restapi.adequateshop.com/api/Tourist</div>
    <div class="tab-remove">x</div>
</div>
*/


const tabContainer = document.getElementById(key.tabContainer);
const tabAdd = document.getElementById(key.tabAdd);

const tabs = [];

let tabCurrent = null;

function renderTab(indexTab){
    tabContainer.removeChild(tabAdd);

    const tabElm = document.createElement("div");
    tabElm.className = "tab";

    let tabData;
    if(indexTab){
        tabData = tabs[indexTab];
    }else {
        tabData = {
            method: "GET",
            url: "",
            id: Date.now(),
            tabElm: tabElm,
            body:"",
            output:""
        }
        tabs.push(tabData);
    }

    const tabMethodELm = document.createElement("div");
    tabMethodELm.className = "tab-method";
    tabMethodELm.innerText = tabData.method;

    const tabNameELm = document.createElement("div");
    tabNameELm.className = "tab-name";
    if(tabData.url){
        tabNameELm.innerText = tabData.url;
    }else{
        tabNameELm.innerText = "New Tab";
    }

    tabData.tabNameELm = tabNameELm;
    tabData.tabMethodELm = tabMethodELm;
    

    const tabRemoveElm = document.createElement("div");
    tabRemoveElm.className = "tab-remove";
    tabRemoveElm.innerText = "x";

    tabRemoveElm.addEventListener("click",function(e){
        console.log(tabData);

        const indexRemove = tabs.findIndex(item => item.id == tabData.id);
        console.log(indexRemove);
        if(indexRemove > -1){
            tabs.splice(indexRemove,1);
            tabContainer.removeChild(tabElm);

            if(tabs.length == 0){
                renderTab();
            }else{
                choseTab(indexRemove - 1);
            }
            
        }

        e.stopPropagation();
    })

    tabElm.appendChild(tabMethodELm);
    tabElm.appendChild(tabNameELm);
    tabElm.appendChild(tabRemoveElm);

    function choseTab(indexChose){
        console.log("chose tab ", indexChose);

        if(tabCurrent){
            tabCurrent.tabElm.classList.remove("tab--active");
        }

        if(indexChose == -1){
            indexChose = 0;
        }

        if(indexChose != undefined){
            tabCurrent = tabs[indexChose];

            console.log(tabCurrent);
        }else{
            tabCurrent = tabData;
        }
        
        tabCurrent.tabElm.classList.add("tab--active");
        inpUrl.value = tabCurrent.url;
        inpMethod.value = tabCurrent.method;
        inpBody.value = tabCurrent.body;
        output.value = tabCurrent.output;
    }


    tabElm.addEventListener("click",function(){
        choseTab();
    })


    choseTab();
    tabContainer.appendChild(tabElm);
    tabContainer.appendChild(tabAdd);
}

renderTab();



tabAdd.addEventListener("click",function(){
    renderTab();
})

inpUrl.addEventListener("input",function(e){
    if(tabCurrent){
        tabCurrent.url = inpUrl.value;
        tabCurrent.tabNameELm.innerText = tabCurrent.url;
    }
})

inpMethod.addEventListener("change",function(e){
    if(tabCurrent){
        tabCurrent.method = inpMethod.value;
        tabCurrent.tabMethodELm.innerText = tabCurrent.method;
    }
})

inpBody.addEventListener("input", function(e){
    if(tabCurrent){
        tabCurrent.body = inpBody.value;
    }
})
