'user strict'

//Import packages and the user model to use
var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = mongoose.model('User');

// Registration handler
exports.register = function (req,res) {
    var newUser = User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password,10);
    newUser.save(function (err, user) {
        if(err)
        {
            return res.status(400).send({
                message : err
            })
        }
        else
        {
            user.hash_password = undefined;
            return res.json(user);
        }
    })
}

//SignIn Handler
exports.signin = function (req, res) {
    User.findOne(
        {
            email : req.body.email
        },
        function (err,user) {
            if(err) throw  err ;
            if(!user)
            {
                res.status(401).json({message : 'authentification failed ,user not found' });
            }
            else if(user)
            {
                if(!user.comparePassword(req.body.password))
                {
                    res.status(401).json({message:'Wrong password'});
                }
                else
                {
                    return res.json({token : jwt.sign({email : user.email , fullName: user.fullName ,_id: user._id},'RestfulAPIs')});
                }
            }
        }
        
    )
}


exports.loginRequired = function (req,res,next) {
    if(req.user){next();}
    else
    {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }

}