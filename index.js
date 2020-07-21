const express = require('express')
const app = express()
const port = 5000
const {User} = require('./models/user')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const key = require('./config/key')
const user = require('./models/user')
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended:'true'}))
app.use(bodyParser.json())
app.use(cookieParser())
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

app.post('/login', (req, res)=>{
  User.findOne(req.body.email, (err, userinfo)=>{
    if(!userinfo){
      return res.json({loginSuccess:false, message:"이메일이 존재하지 않습니다."})
    }
    userinfo.passwordCompare(req.body.password, (err, isMatch)=>{
      if(!isMatch){
        return res.json({loginSuccess:false, message:"비밀번호가 맞지 않습니다."})
      }
      userinfo.generateToken((err, user)=>{
        if(err) return res.status(400).send(err)
        //토큰을 쿠키에 저장하기
        res.cookie("x.auth", user.token).status(200).json({loginSuccess:true, userid:user._id})

      })
    })
  })
})
//12강 복습할것!
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))