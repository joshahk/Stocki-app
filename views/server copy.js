const express = require("express")
const https = require("https");
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

        let error = null;

        shopid = "12496"
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
                console.log("NO AVAILABILITY!")
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
    console.log(store, link, sLink, iName)

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
            

            //Sets store number - Will later be replaced by API with location data
            // var userPosition = 
            //     {
            //     lat: '',
            //     lon: ''};
            //     if(navigator.geolocation)
            //         {
            //             navigator.geolocation.getCurrentPosition(function(position){
            //                 userPosition.lat = position.coords.latitude;
            //                 userPosition.lon = position.coords.longitude;
            //                 console.log(userPosition.lat); //This shows me the latitude

            //             });
            //         }
            //         else
            //         {
            //             console.log("Geolocation not supported by your browser");
            //         }
            //         setTimeout(function () {console.log('Updated::::'+userPosition.lat);},2500);

            // console.log("test before")
            // console.log(navigator.geolocation.getCurrentPosition(showPosition))
            // console.log("test after")

            if (navigator.geolocation) {
                console.log("SUCCESSSSSSSSS");
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
            //console.log(userPosition)


            //console.log(navigator.geolocation)
 
            store = "12496"
            ////////////////////////////////////////////////////


            let stockError = null;
            url = "https://www.zara.com/uk/en/store-stock?physicalStoreIds="+store+"&references="+reference+"&sectionName="+sectionName
            console.log("Zara 2",url)
            

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
                    console.log("NO AVAILABILITY!")
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
    console.log(url)

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
            console.log(product.content.name)
            console.log()
            individual = []
            //console.log("Found: "+product.imagePreviewUrl+" "+product.prices.current.value+" "+product.name)
            //console.log(addRemove)

            //Creating £ cost
            cost = product.content.price
            cost /= Math.pow(100, 1)
            cost= cost.toString()
            cost = "£"+cost
            console.log(cost)
            
            console.log(" ")
            console.log(" ")
            console.log(product.content.detail.colors[0].xmedia[0].path)
            console.log("/w/258/")
            console.log(product.content.detail.colors[0].xmedia[0].name)
            console.log("jpg?ts=")
            console.log(product.content.detail.colors[0].xmedia[0].timestamp)
            console.log(" ")
            console.log(" ")


            image = "https://static.zara.net/photos//"+product.content.detail.colors[0].xmedia[0].path+"/w/258/"+product.content.detail.colors[0].xmedia[0].name+".jpg?ts="+product.content.detail.colors[0].xmedia[0].timestamp
            console.log(image)
            
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
    url = "https://api001-arh.primark.com/bff?operationName=SearchResultsPageQuery&variables=%7B%22q%22%3A%22"+password+"%22%2C%22locale%22%3A%22en-gb%22%2C%22currencyCode%22%3A%22GBP%22%2C%22articlesRows%22%3A22%2C%22productsRows%22%3A24%2C%22start%22%3A0%2C%22efq%22%3Anull%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d531da452aa019783090a043b136102e5b13afe83b04672c9a1bc86472f52a30%22%7D%7D"
    console.log("PRIMARK:", url)

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
        
        result.body.data.content.props.productsData.response.docs.forEach(product =>{
            //console.log(product)
            individual = []
            //console.log("Found: "+product.thumb_image+" "+product.price+" "+product.title)
            //console.log(addRemove)

            //Creating £ cost
            cost = product.price
            cost /= Math.pow(100, 1)
            cost= cost.toString()
            cost = "£"+cost
            //console.log(cost)
            
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




    

    //console.log("FINAL TITLE"+title)
    res.render('search.ejs',{
        SearchItem:title,
        qvals
    })


    
    //console.log(result.body)
    //return await items

})




//console.log(main());

//app.listen(process.env.PORT || 3000)


// Read SSL certificate files
const sslServerKey = fs.readFileSync('server.key', 'utf8');
const sslServerCert = fs.readFileSync('server.cert', 'utf8');

// Create HTTPS server with your Express app
const httpsServer = https.createServer({
    key: sslServerKey,
    cert: sslServerCert
}, app);

httpsServer.listen(3000, () => console.log('HTTPS server running on port 3000'))
    .on('error', (err) => {
        console.error('Failed to start server:', err);
    });