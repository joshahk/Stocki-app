//import needle from "needle";

let cartIcon = document.querySelector('.logo');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let select = document.querySelector('select')
referenceList = []
sizeList = []
sectionTitle = ""
store = ""

//console.log("YES")

cartIcon.onclick = () => {
    cart.classList.add("active");
}

closeCart.onclick = () => {
    cart.classList.remove("active");
}

if (document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
} else{
    ready();
}

function ready(){
    //Add Cart
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i<addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked)
    }
    //var sizeSelector = document.getSelection("cars")
    select.addEventListener("change", testFunction)

    

}

function testFunction(event){
    vart = select.value;
    updateSize(select.value)
}

function setReferenceList(referenceList){
    this.referenceList = referenceList
    //console.log("SUCCESS:"+this.referenceList)
}

function setStore(store){
    this.store = store;
}

function setSectionTitle(sectionTitle){
    this.sectionTitle = sectionTitle
}

function setSizeList(sizeList){
    this.sizeList = sizeList;
}

function updateSize(newSize){
    //console.log("REQUIRED ITEMS, STORE: "+this.store+" RLIST: "+this.referenceList+" NEW SIZE: "+newSize+ "SIZE LIST: "+this.sizeList+ " SECTION TITLE: "+ this.sectionTitle)
    
    localSizeList = this.sizeList
    localReferenceList = this.referenceList
    localStore = this.store
    localSectionTitle = this.sectionTitle

    count = 0
    localSizeList.forEach(each =>{
        if(each==newSize){
            foundReference = localReferenceList[count]
        }
        count+=1
    })

    //console.log(foundReference, localSectionTitle)


    const data = {
        store: localStore,
        reference: foundReference,
        section: localSectionTitle
    };

    body = JSON.stringify(data);
    //console.log(body);

    fetch("/new-size",
    {
        method:"POST",
        headers:{
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "Content-Type":"application/json",
        },
        body: body
    })
    .then(res=>res.json())
    .then(data  => {
        //console.log("SIZE: "+data.size+" AVAILABLE: "+data.stock);
        if (data.stock!=0){
            sizeReturn = "SIZE: "+newSize
            amountReturn = "AVAILABLE: "+data.stock    
        } else{
            sizeReturn = "No Availability"
            amountReturn = ""
        }
        //addProductToCart(sizeReturn,amountReturn,"","","",data.image,data.name,data.sizeList)
        updateCart(sizeReturn,amountReturn)
    })
    
}

function addCartClicked(event){
    cart.classList.add("active");
    var button = event.target;
    var shopProducts = button.parentElement;
    var iName = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].innerText;
    var store = shopProducts.getElementsByClassName("store")[0].innerText;
    var link = shopProducts.getElementsByClassName("external-link")[0].innerText;
    var sLink = shopProducts.getElementsByClassName("hidden-sLink")[0].innerText;
    //console.log(link);

    setStore(store)
    submitData(store,link,sLink,iName,"")

    //addProductToCart(title,price,productImg,store,link)
}


function submitData(store, link, sLink, iName, size) {
    //console.log("SIZE PLEASE:" +size)
    //const name = document.getElementById('name').value;
    //const email = document.getElementById('email').value;

    //console.log(price)
    //console.log(title)


    const data = {
        store: store,
        link: link,
        sLink: sLink,
        iName: iName
    };

    body = JSON.stringify(data);
    //console.log(body);

    fetch("/submit-data",
    {
        method:"POST",
        headers:{
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "Content-Type":"application/json",
        },
        body: body
    })
    .then(res=>res.json())
    .then(data  => {
        console.log("SIZE: "+data.size+" AVAILABLE: "+data.stock);
        if (data.stock!=0){
            sizeReturn = "SIZE: "+data.size
            amountReturn = "AVAILABLE: "+data.stock
            //console.log(data.referenceList)
            setReferenceList(data.referenceList)
            setSizeList(data.sizeList)
            setSectionTitle(data.sectionTitle)
        } else{
            sizeReturn = "No Availability"
            amountReturn = ""
        }
        addProductToCart(sizeReturn,amountReturn,"","","",data.image,data.name,data.sizeList)
    })
}

function updateCart(size,amount){
    //Body Main Text
    var cartItems = document.getElementsByClassName("detail-box")[0];
    var cartBoxContent=`<div class="cart-product-title">${size}</div>
                        <div class="cart-price">${amount}</div>`;
    cartItems.innerHTML = cartBoxContent;
}

function addProductToCart(size,amount,productImg,store,link,sLink,iName,sizeList){

    //Body Main Text
    var cartItems = document.getElementsByClassName("cart-contents")[0];
    var cartBoxContent=`<img src="${sLink}" alt="" class="cart-img">
                        <div class="detail-box">
                        <div class="cart-product-title">${size}</div>
                        <div class="cart-price">${amount}</div>
                        </div>`;
    cartItems.innerHTML = cartBoxContent;


    //Text for item title
    var cartItemsTitle = document.getElementsByClassName("cart-name")[0];
    var cartBoxTitleContent=`<h2 class="cart-title">${iName}</h2>`;
    cartItemsTitle.innerHTML = cartBoxTitleContent;


    //Drop Down List Sizes
    var HTMLSizes
    sizeList.forEach(sz =>{
        HTMLSizes+=`<option vavlue=${sz}>${sz}</option>`
        
        //console.log(cartItemsDropDown)
    })


    sz="iahsdas"
    //var carBoxContent=`<option vavlue=${sz}>${sz}</option>`;
    var shh = document.getElementsByName("cars")[0];
    //var hss=`<option vavlue=${sz}>${sz}</option>`;
    //hss +=`<option vavlue="`+`BEANS`+`>${sz}</option>`
    shh.innerHTML = HTMLSizes;

    //cartItemsDropDown.innerHTML = cartBoxDropDownContent;



    
    
}
