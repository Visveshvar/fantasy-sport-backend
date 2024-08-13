var mdb=require('mongoose')
var userSchema=mdb.Schema({
    email:{type:String,unique:true,required:true},
    fullname:{type:String,required:true},
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    confirmpassword:{type:String,required:true}
    
})
var user_schema=mdb.model("users",userSchema)
module.exports=user_schema;