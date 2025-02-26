const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Product = require('./models/productModel')

dotenv.config({path : './config.env'})
const url =process.env.URI
mongoose.connect(url)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  const prodcts = JSON.parse(fs.readFileSync(`utils\\dummyData\\product.json`, 'utf-8'));

  const importData = async()=>{
    try{
        await Product.create(prodcts,{validateBeforeSave:false})
       
        console.log('imported done')
    }catch(err){
        console.log(err);
    }
    process.exit()
}  

// delete Data
const deleteData = async()=>{
    try{
        await Product.deleteMany()
       
        console.log('deleted done')
    } catch(err){
        console.log(err);
    }
    process.exit() 
}

if(process.argv[2] === '--import'){
  importData()
}else if (process.argv[2] === '--delete'){
  deleteData()
}
//importData()
//deleteData()