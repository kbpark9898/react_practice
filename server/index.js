const express = require('express')
const app = express()
const port = 5000
const {User} = require('../models/user')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const key = require('./config/key')
const user = require('../models/user')
const cookieParser = require('cookie-parser')
const {auth} = require('./middleware/auth')

app.use(bodyParser.urlencoded({extended:'true'}))
app.use(bodyParser.json())
app.use(cookieParser())
mongoose.connect(key.mongoURI, {
    useNewUrlParser : "true", useUnifiedTopology:"true", useCreateIndex:"true", useFindAndModify:"false"
}).then(() => console.log("cunnect success"))
  .catch(err => console.log(err))
app.get('/', (req, res) => res.send('안녕하세요! 연결되나요?'))

app.post('/api/user/register', (req, res)=>{
  const user = new User(req.body)
  user.save((err,userInfo)=>{
    if(err) return res.json({success:false, err})
    return res.status(200).json({success:true})
  })
})

app.post('/api/user/login', (req, res)=>{
  User.findOne({email:req.body.email}, (err, userinfo)=>{
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
        res.cookie("x_auth", user.token).status(200).json({loginSuccess:true, userid:user._id})

      })
    })
  })
})

app.get('/api/user/auth', auth, (req, res)=>{
  //여기까지 미들웨어를 통과하여 인증되었다면, authentication이 완료되었다는 말
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role === 0 ? false:true,
    isAuth:true,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role
  })
})
app.get('/api/user/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id:req.user._id}, {token:""}, (err, user)=>{
    if(err) return res.json({success:false, err})
    return res.status(200).send({success:true})
  })
})
//12강 복습할것!
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))