const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors');
const bodyParser= require('body-parser');






const app = express()

app.use(express.json());
app.use(cors());
const port = 5000



//from mongo db cluster-connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktoki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ema-john-store").collection("products");
   const ordersCollection= client.db("ema-john-store").collection("orders");
  //adding products
  app.post('/addProduct',(req,res)=> {
        const products=req.body; 
        collection.insertOne(products)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
        
    })


    //read
    app.get('/products',(req,res)=>{
        collection.find({})    
            .toArray((err,documents)=>{
            res.send(documents);
        })
    })

//single product
    app.get('/product/:key',(req,res)=>{
        collection.find({key:req.params.key})    
            .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })

    //post

    app.post('/productsByKeys',(req,res)=> {
        const productKeys=req.body;
        collection.find({key:{ $in: productKeys}})
        .toArray((err,documents)=>{
            res.send(documents);
    })
})
   //take order
   app.post('/addOrder',(req,res)=> {
    const orders=req.body; 
    ordersCollection.insertOne(orders)
    .then(result=>{
      
        res.send(result.insertedCount>0)
    })
    
})
});



app.listen(port, 5000)
