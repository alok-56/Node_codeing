import fetch from "node-fetch";
import express from "express";
import './DB/config.js'
import apimodel from "./DB/schema.js";
import mongoose from "mongoose";
mongoose.set('strictQuery', true);
const app = express();


//-------------fetching of api and storing in  datbase-------------------//



app.get('/api/store', async (req, res) => {
    let data = await fetch(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`);
    data = await data.json();
    var api;
    for (var i = 0; i < data.length; i++) {
        api = new apimodel({
            id: data[i]['id'],
            title: data[i]['title'],
            price: data[i]['price'],
            description: data[i]['description'],
            category: data[i]['category'],
            image: data[i]['image'],
            sold: data[i]['sold'],
            dateofsale: data[i]['dateOfSale']
        })
        api = await api.save();
    }
    res.send("saved")

})


//------------------------------STORING DATE End----------------------------------------------//


//------------------------Api statistices----------------------------------------//

app.get('/api/statistices/:month', async (req, res) => {
    let data = await apimodel.find()
    let sum = 0;
    let sold = 0;
    let notsold = 0;
    let mon = req.params.month;
    mon = Number(mon)
    if (data) {
        for (var i = 0; i < data.length; i++) {
            let ab = data[i]['dateofsale'];
            let date = new Date(ab).getMonth()
            if (date == mon) {
                sum = sum + Number(data[i].price);
                if (data[i].sold === 'true') {
                    sold = sold + 1;
                }
            }
            notsold = data.length - sold;

        }
    }
    res.send({
        code: 200, data: {
            "total sell": sum,
            "total sold item": sold,
            "notsold": notsold

        },
    })

})

//---------------------------------STATICTS API END---------------------------------------//



//-----------------------------BAR CHART API---------------------------------//


app.get('/api/bar/:month', async (req, res) => {
    let data = await apimodel.find();
    let min = 0;
    let min2 = 0;
    let min3 = 0;
    let min4 = 0;
    let min5 = 0;
    let min6 = 0;
    let min7 = 0;
    let min8 = 0;
    let min9 = 0;
    let mon = req.params.month;
    mon = Number(mon)
    if (data) {
        for (var i = 0; i < data.length; i++) {
            let ab = data[i]['dateofsale'];
            let date = new Date(ab).getMonth()

            if (date == mon) {
                if (data[i].price > 0 && data[i].price <= 100) {
                    min = min + 1;
                }
                else if (data[i].price > 100 && data[i].price <= 200) {
                    min2 = min2 + 1;
                }
                else if (data[i].price > 200 && data[i].price <= 300) {
                    min3 = min3 + 1;
                }
                else if (data[i].price > 300 && data[i].price <= 400) {
                    min4 = min4 + 1;
                }
                else if (data[i].price > 400 && data[i].price <= 500) {
                    min5 = min5 + 1;
                }
                else if (data[i].price > 500 && data[i].price <= 600) {
                    min6 = min6 + 1;
                }
                else if (data[i].price > 600 && data[i].price <= 700) {
                    min7 = min7 + 1;
                }
                else if (data[i].price > 700 && data[i].price <= 800) {
                    min8 = min8 + 1;
                }
                else if (data[i].price > 900) {
                    min9 = min9 + 1;
                }

            }

        }
    }
    else {
        res.send({ code: 200, message: "not found" })
    }
    res.send({
        code: 200, message: "found", data: {
            "0-100": min,
            "101-200": min2,
            "201-300": min3,
            "301-400": min4,
            "401-500": min5,
            "501-600": min6,
            "601-700": min7,
            "701-800": min8,
            "901-above": min9
        }
    })
})

//------------------------------BAR CHART API END--------------------------------//




//------------------------------PIE CHART API----------------------//

app.get('/api/pie/:month', async (req, res) => {
    let data = await apimodel.find();
    let mens = 0;
    let women = 0;
    let electro = 0;
    let jwel = 0;
    let mon = req.params.month;
    mon = Number(mon)
    if (data) {
        for (var i = 0; i < data.length; i++) {
            let ab = data[i]['dateofsale'];
            let date = new Date(ab).getMonth()

            if (date == mon) {
                if (data[i].category === "men's clothing") {
                    mens++;
                }
                else if (data[i].category === "jewelery") {
                    jwel++;
                }
                else if (data[i].category === "electronics") {
                    electro++;
                }
                else if (data[i].category === "women's clothing") {
                    women++;
                }
            }
        }
    }
    else {
        res.send({ code: 200, message: "no item found" })
    }
    res.send({
        code: 500,
        message: "found",
        data: {
            "men's category": mens,
            "women's category": women,
            "electronics category": electro,
            "jwewelley": jwel
        }
    })
})

// //------------------------------PIE API END----------------------------------// 




//------------------------------COMBINE API-------------------------//


app.get('/api/combine/:key', async (req, res) => {
    let key = req.params.key;
    let data1 = await fetch(`http://localhost:3000/api/statistices/${key}`);
    let data2 = await fetch(`http://localhost:3000/api/bar/${key}`);
    let data3 = await fetch(`http://localhost:3000/api/pie/${key}`);
    data1 = await data1.json();
    data2 = await data2.json();
    data3 = await data3.json();
    res.send({ data1, data2, data3 })
})


//-------------------------------COMBINE API END--------------------------------//




app.listen(3000)


