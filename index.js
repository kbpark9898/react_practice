const express = require('express')
const app = express()
const port = 5000
const db_url = "mongodb+srv://kbpark9898:<password>@boiler-plate.m8yyl.mongodb.net/<dbname>?retryWrites=true&w=majority"
const {User} = require('./models/user')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
app.use(bodyParser.urlencoded({extended:'true'}))
app.use(bodyParser.json())
mongoose.connect("mongodb://kbpark9898:park0130@boiler-plate-shard-00-00.m8yyl.mongodb.net:27017,boiler-plate-shard-00-01.m8yyl.mongodb.net:27017,boiler-plate-shard-00-02.m8yyl.mongodb.net:27017/boiler-plate?ssl=true&replicaSet=atlas-nkbm0s-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useNewUrlParser : "true", useUnifiedTopology:"true", useCreateIndex:"true", useFindAndModify:"false"
}).then(() => console.log("cunnect success"))
  .catch(err => console.log(err))
app.get('/', (req, res) => res.send('안녕하세요!'))

app.post('/register', (req, res)=>{
  //회원가입에 필요한 정보를 client 에게서 받아오면 데이터베이스에 넣어준다.
  //7강 8분부터 이어서 시청할것

})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))