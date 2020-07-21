const express = require('express')
const app = express()
const port = 5000
const {User} = require('./models/user')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const key = require('./config/key')
const user = require('./models/user')
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

// app.post('/login', (req, res)=>{
//   User.findOne({email: req.body.email}, (err, userInfo)=>{
//     if(!userInfo){
//       return res.json({
//         loginSucccess:false,
//         message:"찾고자 하는 계정 정보가 존재하지 않습니다."
//       })
//     }
//     userInfo.comparePassword(req.body.password, (err, isMatch)=>{
//       if(!isMatch){
//         return res.json({loginSucccess:false, message:"비밀번호가 맞지 않습니다. 다시 시도해주세요."})
//       }
//     })
//   })
// })

app.post('/login', (req, res)=>{
  User.findOne(req.body.email, (err, userinfo)=>{
    if(!userinfo){
      return res.json({loginSuccess:false, message:"이메일이 존재하지 않습니다."})
    }
    userinfo.passwordCompare(req.body.password, (err, isMatch)=>{
      if(!isMatch){
        return res.json({loginSuccess:false, message:"비밀번호가 맞지 않습니다."})
      }
    })
  })
})
//12강 시청할것!
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))