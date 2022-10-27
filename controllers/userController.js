const Users = require("../model/userModel")
const bcrypt = require("bcrypt")


module.exports.register = async (req, res, next) => {
    try{
        const {username, email , password}  = req.body;
        const usernameCheck = await Users.findOne({username})
        if(usernameCheck){
            return res.json({msg:" Username Already used", status: false} )
        }
        const emailCheck = await Users.findOne({email})
        if(emailCheck){
            return res.json({msg:" Email Already used", status: false} )
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            email,
            username,
            password : hashedPassword,
            profilePic : 0,
            profilePicColor : "black",
        });
        delete user.password;
        return res.json({status: true, user})
    }catch (err) {
        console.log(err)
    }

    
};


module.exports.login = async (req, res, next) => {
    try{
        const {username, password}  = req.body;
        const user = await Users.findOne({username})
        if(!user){
            return res.json({msg:" Incorrect username or password", status: false} )
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({msg:"Incorrect username or password", status: false} )
        }
        delete user.password

        return res.json({status:true , user})
    }catch (err) {
        console.log(err)
    }

    
};

module.exports.setProfilePic = async (req, res, next) => {
    try{
        const {username, profilePic, color}  = req.body;
        console.log(req.body)
        const filter = {username : username}
        const update = {
            profilePic : profilePic,
            profilePicColor : color
        }
        await Users.findOneAndUpdate(filter, update)
        const user = await Users.findOne(filter)
        return res.json({status:true , user})

    }catch (err) {
        console.log(err)
    }

    
};

module.exports.allUsers = async (req, res, next) => {
    try{
        const users = await Users.find({_id: {$ne:req.params.id} }).select([
            "email", 
            "username", 
            "profilePic", 
            "profilePicColor", 
            "_id"
        ]);
        return res.json({status:true, users})

    }catch (err) {
        console.log(err)
    }

    
};