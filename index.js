var fs = require('fs')
var request = require('request')
var moment = require('moment');

var start = 30160926
var path = '192.168.2.28:27017'
var dbname = 'pantip_month10'
var collection = 'facebook_share'
//var collection = 'kong_test'
var fileLog = 'd:/node-fb/log.txt'

var MongoClient = require('mongodb').MongoClient,
    test = require('assert')

MongoClient.connect(`mongodb://${path}/${dbname}`, (err, db) => {
    if (err) throw err;
    var inc = 0
   
    var intervalID = setInterval(function() {
        inc++
       
        var topic_id = start+inc;
      
        var items = [
            '267791366593789|I_g9nUtGzxRzK2FBU_M1HQybm4k',
            '135089869885647|tqtr281_PQRnk_q_1UlvD7neEwE',
            '175757182458500|j40T8YXY0N-UlMtDRjCwZFH8OsY',
            '166988046703349|2Sgdoqkr-zqJTMiVWMO3JAydvEk',
        ]
        randomNumber = rand(0, items.length - 1);
        randomItem = items[randomNumber];
        var access_token = randomItem
        var url  = `https://graph.facebook.com/v2.8/?fields=share&id=http://pantip.com/topic/${topic_id}&access_token=${access_token}`
        request(url, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) {
               
                try {
                    var parsed = JSON.parse(body)
                    var str = `${moment().format('MMMM D YYYY, H:mm:ss')}-------${topic_id}------${parsed.share.share_count}`
                    //console.log(str)
                 
                    db.collection(collection).insertOne({
                        _id:topic_id,
                        shares:parsed.share.share_count
                    },(err, result)=>{
                        fs.appendFile(fileLog,str+'\n', function (err,data) {
                            
                        });
                    })
                } catch (e) {
                    var str = `${moment().format('MMMM D YYYY, H:mm:ss')}------${e.message}`
                    //console.log(str)

                    fs.appendFile(fileLog,str+'\n', function (err,data) {
                        
                    });
                }
                
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






