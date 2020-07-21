const express = require('express')
const app = express()
const port = 5000
const db_url = "mongodb+srv://kbpark9898:<password>@boiler-plate.m8yyl.mongodb.net/<dbname>?retryWrites=true&w=majority"
const {User} = require('./models/user')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const key = require('./config/key')
app.use(bodyParser.urlencoded({extended:'true'}))
app.use(bodyParser.json())
mongoose.connect(key.mongoURI, {
    useNewUrlParser : "true", useUnifiedTopology:"true", useCreateIndex:"true", useFindAndModify:"false"
}).then(() => console.log("cunnect success"))
  .catch(err => console.log(err))
app.get('/', (req, res) => res.send('안녕하세요! 연결되나요?'))

app.post('/register', (req, res)=>{
  const user = new User(req.body)
  user.save((err,userInfo)=>{
    if(err) return res.json({success:false, err})
    return res.status(200).json({success:true})
  })
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))