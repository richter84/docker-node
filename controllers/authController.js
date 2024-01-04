const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

    const {username, password} = req.body;

    try{
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({username: username, password: hashpassword});
        req.session.user = newUser;
        res.status(201).json({
            status: "success",
            data:{
                user: newUser
            }
        });
    }
    catch(e){
        res.status(400).json({
            status: "fail"
        });
    }
}


exports.login = async (req, res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});
        if (!user){
            res.status(404).json({
                status: "fail",
                message: "user not found"
            }); 
            return;
        }

        const isMatched = await bcrypt.compare(password, user.password);
        
        if(isMatched){
            req.session.user = user;
            res.status(200).json({
                status: "success",
                message: "user logged in"
            }); 
        }
        else{
            res.status(200).json({
                status: "fail",
                message: "incorrect username or password"
            });  
        }
    }
    catch(e){
        res.status(400).json({
            status: "fail"
        });
    }
}