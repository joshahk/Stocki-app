const express = require("express")
const http = require("http");
const fs = require("fs");
const needle = require("needle");
const app = express()

app.set('view-engine','ejs')
app.use(express.urlencoded({extended: false}))

app.use('/css', express.static(__dirname + '/css'))
app.use('/img', express.static(__dirname + '/img'))
app.use('/images', express.static(__dirname + '/images'))
app.use('/js', express.static(__dirname + '/js'))
app.use(express.urlencoded({extended:true}))
const bodyParser = require('body-parser');
app.use(bodyParser.json());

function stalk(){
    this.stalked="House knowing"
}


app.get('/', (req,res) => {
    res.render('index.ejs')
})

app.get('/index', (req,res) => {
    res.render('index.ejs')
})

app.get('/about', (req,res) => {
    res.render('about.ejs')
})

app.get('/contact', (req,res) => {
    res.render('contact.ejs')
})

app.get('/team', (req,res) => {
    res.render('team.ejs')
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})

function triggerBtnClick(){
    document.getElementById('btn').click()
}

app.post('/new-size', async (req, res) => {

    const data = req.body;
    
    
    store = data.store
    reference = data.reference
    sectionName = data.section

    


    

    const returnData = {
        stock: ""
    };


    //CHECKING STOCK INFO
    //navigator.geolocation.getCurrentPosition((position) => {
        //doSomething(position.coords.latitude, position.coords.longitude);
    if(store=="ZARA"){
        //////////////////////////////////////////////////////
        ///////////////////ZARA SIZE UPDATE///////////////////
        //////////////////////////////////////////////////////


        

        shopid = "12496"
        url = "https://www.zara.com/uk/en/stores-locator/search?lat="+loc.lat+"&lng="+loc.lon+"&isDonationOnly=false&ajax=true"
        


        try{
            const result = await needle(
                "get",
                url,
                { headers: 
                    {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                    "Content-Type":"application/json"
                    }
                }
            ); 

            
            shopid = result.body[0].id
            
            
            
                
        } catch (error) {
            title = null;
            error = "ERROR";
            console.log("ERROR:"+error)
        }

        //////////


        let error = null;

        //shopid = "12496"
        url = "https://www.zara.com/uk/en/store-stock?physicalStoreIds="+shopid+"&references="+reference+"&sectionName="+sectionName

        try{
            const result = await needle(
                "get",
                url,
                { headers: 
                    {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                    "Content-Type":"application/json"
                    }
                }
            ); 
            items = []
            if (result.body.productAvailability.length>0){
                returnData.stock=result.body.productAvailability[0].availableProducts[0].stock
            } else{
                returnData.stock="0"
                
            }


                
            
            res.send(returnData)
            
                //console.log("SUCCESS NOW!.")
        } catch (error) {
            title = null;
            error = "ERROR";
            console.log("ERROR:"+error)
        }

        

    } else if(store=="H&M"){
        res.send({Store:"H&M"});
    } else if(store=="Primark"){
        res.send("Store Primark");
    } else{
        res.send("Data received successfully!");
    }

    

    
});



app.post('/submit-data', async (req, res) => {
    const data = req.body;
    //console.log(req)
    //console.log("Received data:", data.store,data.link);
    store = data.store
    link = data.link
    sLink = data.sLink
    iName = data.iName
    //console.log(store, link, sLink, iName)

    shopid = "12496"
    url = "https://www.zara.com/uk/en/stores-locator/search?lat="+loc.lat+"&lng="+loc.lon+"&isDonationOnly=false&ajax=true"
    //console.log(url)


    try{
        const result = await needle(
            "get",
            url,
            { headers: 
                {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                "Content-Type":"application/json"
                }
            }
        ); 

        
        shopid = result.body[0].id
        
        
        
            
    } catch (error) {
        title = null;
        error = "ERROR";
        console.log("ERROR:"+error)
    }


    // Process data (e.g., save to a database, etc.)

    const returnData = {
        image: "",
        stock: "",
        name: "",
        price: "",
        size: "",
        sizeList: [],
        referenceList: [],
        sectionTitle: ""
    };


    //console.log("STORE:"+store);
    if(store=="ZARA"){
        ////////////////////////////////////////////////
        ///////////////////ZARA STOCK///////////////////
        ////////////////////////////////////////////////


        ///

        
        link = link.slice(1);
        sLink = sLink.slice(1);
        

        let error = null;
        url = "https://www.zara.com/uk/en/products-details?productIds="+link+"&ajax=true"



        try{
            const result = await needle(
                "get",
                url,
                { headers: 
                    {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                    "Content-Type":"application/json"
                    }
                }
            ); 
            sizesList = []
            referencesList = []
            reference = result.body[0].detail.colors[0].sizes[0].reference
            sectionName = result.body[0].sectionName
            
            //Creates list of sizes available for this product//
            result.body[0].detail.colors[0].sizes.forEach(eachSize =>{
                sizesList.push(eachSize.name)
            });
            ////////////////////////////////////////////////////

            //Creates list of sizes available for this product//
            result.body[0].detail.colors[0].sizes.forEach(eachSize =>{
                referencesList.push(eachSize.reference)
            });
            ////////////////////////////////////////////////////



            //console.log(navigator.geolocation)

            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////
            ////////////////////////////////////////////////////HERE
            ////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
 
            
            ////////////////////////////////////////////////////


            let stockError = null;
            url = "https://www.zara.com/uk/en/store-stock?physicalStoreIds="+shopid+"&references="+reference+"&sectionName="+sectionName
            
            

            try{
                const result = await needle(
                    "get",
                    url,
                    { headers: 
                        {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                        "Content-Type":"application/json"
                        }
                    }
                ); 
                items = []
                if (result.body.productAvailability.length>0){
                    returnData.stock=result.body.productAvailability[0].availableProducts[0].stock
                    returnData.size=result.body.productAvailability[0].availableProducts[0].size
                    returnData.image=sLink
                    returnData.name=iName
                    returnData.sizeList = sizesList
                    returnData.referenceList = referencesList
                    returnData.sectionTitle = sectionName
                } else{
                    returnData.stock="0"
                    returnData.image=sLink
                    returnData.name=iName
                    
                }


                
            
                res.send(returnData)
            
                //console.log("SUCCESS NOW!.")
            } catch (error) {
                title = null;
                stockError = "ERROR";
                console.log("ERROR:"+stockError)
            }





        } catch (error) {
            title = null;
            error = "ERROR";
            //console.log("ERROR NOW!.")
        }













    } else if(store=="H&M"){
        res.send({Store:"H&M"});
    } else if(store=="Primark"){
        res.send("Store Primark");
    } else{
        res.send("Data received successfully!");
    }

    

    
});


app.get('/search', async (req,res) => {
    
    //console.log(url)
    

    const password = req.query.password;
    
    //console.log("INPUT:"+password)


    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //H&M
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    let title;
    let error = null;
    url = "https://www2.hm.com/en_gb/search-results/_jcr_content/search.display.json?q="+password+"&department=1&sort=stock&image-size=small&image=model&offset=40&page-size=40"

    try{
        const result = await needle(
            "get",
            url,
            { headers: 
                {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                "Content-Type":"application/json"
                }
            }
        ); 
        
        items = []
        result.body.products.forEach(product =>{
            individual = []
            const removeFirst2 = product.image[0].src.slice(2);
            const addRemove = "https://" + removeFirst2
            //console.log(addRemove)
            //console.log("")
            individual.push(product.title,product.price,addRemove,product.articleCode,"H&M")
            items.push(individual)
            //console.log("NAME"+individual)
        });
        title = password
    } catch (error) {
        title = null;
        error = "ERROR";
    }
    qvals = []
    //loc = []
    for (var fieldIndex = 0; fieldIndex < items.length; fieldIndex ++) {
        things = {
            pTitle:items[fieldIndex][0],
            pPrice:items[fieldIndex][1],
            sLink:items[fieldIndex][2],
            iCode:items[fieldIndex][3],
            store:items[fieldIndex][4]
        }
        qvals.push(things)
    }
    //console.log(qvals)
    try{
        title = title.replace(" ", "_");
    } catch (error){
        title="Search"
    }
    console.log("H&M Complete")

    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //Zara
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    let zaraTitle;
    let zaraError = null;
    url = "https://www.zara.com/itxrest/1/search/store/10706/query?query="+password+"&locale=en_GB&session=&deviceType=desktop&deviceOS=Mac%20OS&deviceOSVersion=10.15.7&catalogue=24054&warehouse=19551&section=WOMAN&scope=default&origin=default&ajax=true"
    //    console.log(url)

    try{
        const result = await needle(
            "get",
            url,
            { headers: 
                {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                "Content-Type":"application/json"
                }
            }
        ); 
        
        items = []
        
    //        console.log(result.body.results)

        result.body.results.forEach(product =>{
            
            individual = []
            //console.log("Found: "+product.imagePreviewUrl+" "+product.prices.current.value+" "+product.name)
            //console.log(addRemove)

            //Creating £ cost
            cost = product.content.price
            cost /= Math.pow(100, 1)
            cost= cost.toString()
            cost = "£"+cost
            
            
            


            image = "https://static.zara.net/photos//"+product.content.detail.colors[0].xmedia[0].path+"/w/258/"+product.content.detail.colors[0].xmedia[0].name+".jpg?ts="+product.content.detail.colors[0].xmedia[0].timestamp
            
            
            individual.push(product.content.name,cost,image,product.content.id,"ZARA")
            //individual.push(product.title,product.price,addRemove,product.articleCode,"H&M")
            items.push(individual)
            //console.log("NAME"+individual)
        });
        zaraTitle = password
    } catch (error) {
        zaraTitle = null;
        zaraError = "ERROR";
    }

    for (var fieldIndex = 0; fieldIndex < items.length; fieldIndex ++) {
        things = {
            pTitle:items[fieldIndex][0],
            pPrice:items[fieldIndex][1],
            sLink:items[fieldIndex][2],
            iCode:items[fieldIndex][3],
            store:items[fieldIndex][4]
        }
        qvals.push(things)
    }
    console.log("Zara Complete")


    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //Primark
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    let primarkTitle;
    let primarkError = null;
    url = "https://api001-arh.primark.com/bff-002?operationName=BloomreachSearchByKeyword&variables=%7B%22q%22%3A%22"+password+"%22%2C%22efq%22%3Anull%2C%22start%22%3A0%2C%22rows%22%3A24%2C%22locale%22%3A%22en-gb%22%2C%22fq%22%3A%5B%5D%2C%22sort%22%3A%22%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%222652d4747ca5dfd6273da3f8432dcf0cc9e2c404984a11d730604aef43e7d14a%22%7D%7D"
    

    try{
        const result = await needle(
            "get",
            url,
            { headers: 
                {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
                }
            }
        ); 
        
        items = []
        
        result.body.data.bloomreachSearchByKeyword.response.docs.forEach(product =>{
            individual = []
            

            //Creating £ cost
            cost = product.price
            cost /= Math.pow(100, 1)
            cost= cost.toString()
            cost = "£"+cost
            
            individual.push(product.title,cost,product.thumb_image,"1234","Primark")
            items.push(individual)
        });
        zaraTitle = password
    } catch (error) {
        primarkTitle = null;
        primarkError = "ERROR";
        console.log("ERROR",title,error)
    }
    
    for (var fieldIndex = 0; fieldIndex < items.length; fieldIndex ++) {
        things = {
            pTitle:items[fieldIndex][0],
            pPrice:items[fieldIndex][1],
            sLink:items[fieldIndex][2],
            iCode:items[fieldIndex][3],
            store:items[fieldIndex][4]
        }
        qvals.push(things)
    }
    console.log("Primark Complete")

    loc={
        lat:"hello",
        lon:"bye"
    }
    //loc.push(thingstwo)
    //loc = thingstwo
    




    //////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //Location 
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    let locationError = null;
    const postcode = req.query.location;
    //
    url = "http://api.openweathermap.org/geo/1.0/zip?zip="+postcode+",GB&appid=4f329e8f58fb0bef138c9f752dbc8bfd"

    try{
        const result = await needle(
            "get",
            url,
            { headers: 
                {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
                }
            }
        ); 
        
        items = []
        
        loc.lat = result.body.lat
        loc.lon = result.body.lon
        
      
    } catch (error) {
        loc.lat = "PROBLEM"
        loc.lon = "PROBLEM"
        locationError = "ERROR";
        console.log("ERROR",title,error)
    }
    console.log("Location Complete")
    ////





    //console.log("FINAL TITLE"+title)
    res.render('search.ejs',{
        SearchItem:title,
        qvals,
        loc
    })


    
    //console.log(result.body)
    //return await items

})




//console.log(main());

app.listen(process.env.PORT || 3000)


