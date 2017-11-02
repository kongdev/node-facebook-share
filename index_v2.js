var fs = require('fs')
var request = require('request')
var moment = require('moment');

var inc = 3
//var start = 30795397
var start = 37043002
var cal = (start+inc)-(inc+1)
var path = '192.168.2.28:27017'
var dbname = 'pantip_month10'
var collection = 'facebook_share'
//var collection = 'kong_test'
var domain = 'http://pantip.com/topic/'
var fileLog = 'd:/node-fb/log_v2.txt'


var MongoClient = require('mongodb').MongoClient,
test = require('assert')

MongoClient.connect(`mongodb://${path}/${dbname}`, (err, db) => {
    if (err) throw err;

    var intervalID = setInterval(function () {
        
       
         var topic_id = cal+inc;
         
         inc = inc+3
         //console.log(topic_id)
         var items = [
            '267791366593789|I_g9nUtGzxRzK2FBU_M1HQybm4k',
            '135089869885647|tqtr281_PQRnk_q_1UlvD7neEwE',
            '175757182458500|j40T8YXY0N-UlMtDRjCwZFH8OsY',
            '166988046703349|2Sgdoqkr-zqJTMiVWMO3JAydvEk',
        ]
        randomNumber = rand(0, items.length - 1);
        randomItem = items[randomNumber];
        var access_token = randomItem
        
        
         var param = `${domain}${topic_id-1},${domain}${topic_id},${domain}${topic_id+1}`
         var url  = `https://graph.facebook.com/v2.8/?fields=share&ids=${param}&access_token=${access_token}`
         //console.log(url)
         request(url, function (error, response, body) 
         {
             //console.log(body)
             if (!error && response.statusCode == 200) {
                 try {
                     var o = JSON.parse(body)
                     Object.keys(o).forEach((val,key)=> {
                         var tid  = val.replace(domain, "")
                         var share = o[val].share.share_count
                         var str = `${moment().format('MMMM D YYYY, H:mm:ss')}-------${tid}------${share}`
                         console.log(str)

                         db.collection(collection).insertOne({
                             _id:parseInt(tid),
                             shares:share
                         },(err, result)=>{
                             fs.appendFile(fileLog,str+'\n', function (err,data) {
                                 
                             });
                         })
     
                     });
                    
                 } catch (e) {
     
                     var str = `${moment().format('MMMM D YYYY, H:mm:ss')}------${e.message}`
                     //console.log(str)
     
                     fs.appendFile(fileLog,str+'\n', function (err,data) {
                         
                     });
                 }
                 
                 //console.log(o)
           
                
                
             }
         });
     
     
     
     
     }, 300);  
})



function rand(min, max) {
    var offset = min;
    var range = (max - min) + 1;

    var randomNumber = Math.floor( Math.random() * range) + offset;
    return randomNumber;
}