const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(request,response){
    response.sendFile(__dirname + "/index.html");
})

app.post('/',function(reque,response){

    const appid = process.env.API_KEY ;
    const loc = reque.body.loc ;
    const units = "metric" ;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+loc+"&appid="+appid+"&units="+units;

    https.get(url,function(resp){
        console.log(resp.statusCode);
    

        resp.on("data",function(data){
            const weather = JSON.parse(data);
            const temp = weather.main.temp;

            const icon = weather.weather[0].icon ;
            const imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png" ;

            const des = weather.weather[0].description;
            const country = weather.sys.country;

            let today = new Date();
            let options ={
                weekday : "long",
                day: "numeric",
                month:"long"
            };
           let day = today.toLocaleDateString("en-US",options);

            // response.send(`<h1>${loc} - ${country}</h1>
            //             <h1>The temperature here is ${temp} deg Celcius</h1>
            //             <h2>& the weather description is ${des}</h2>
            //             <img src="${imgURL}">`) ;


            response.render("result.ejs",{loc : loc , day : day , img : imgURL , des : des , temp : temp});

        })
    })
});



app.listen(3000,function(){
    console.log("Server is running");
})

