const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10
var jwt = require("jsonwebtoken")
const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre("save", function(next){
    var usr = this;
    if(usr.isModified("password")){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(usr.password, salt, function(err, hash){
                if(err) return next(err)
                usr.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})
// userSchema.method.comparePassword = function(plainPassword, cb){
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if(err) return cb(err),
//             cb(null, isMatch)

//     })
// }

userSchema.method.passwordCompare = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}
userSchema.method.generateToken =function(cb){
    //jsonwebtoken을 이용해서 토큰 생성
    var user = this;
    var token = jwt.sign(user._id, 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}
const User = mongoose.model("User", userSchema)

module.exports={User}