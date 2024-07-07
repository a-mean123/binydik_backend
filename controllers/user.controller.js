const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const passport = require('passport');

const { sendEmail } = require('./mailing.controller');


// Generate Access Token
function generateAccessToken(user) {
    return jwt.sign({ id: user._id }, process.env.SECRET_KEY_USER, { expiresIn: '20m' });
}

function generateAccessTokenAfterRefresh(user) {
    return jwt.sign({ id: user.id }, process.env.SECRET_KEY_USER, { expiresIn: '20m' });
}

// Generate Access Token
function generateRefreshToken(user) {
    return jwt.sign({ id: user._id }, process.env.REFRESH_KEY_USER, { expiresIn: '7d' });
}

let refreshTokens = [];



const createAdminAccount = async () => {

    try {

        let existAdmin = await User.find({ role: 'admin' });
        if (existAdmin.length == 0) {
            let data = {
                fullname: 'Bin YDIK',
                email: process.env.EMAIL,
                password: process.env.ADMIN_PASS,
                ville: 'djerba'
            }
            let admin = new User(data);
            admin.role = 'admin';
            let salt = bcrypt.genSaltSync(10);
            admin.password = bcrypt.hashSync(data.password, salt);
            await admin.save();
            console.log('admin created , you can now use the application:)');
        }

    } catch (error) {
        console.log(error);
    }

}


const register = async (req, res) => {
    const { fullname, email, password, tel, ville } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullname, email, password: hashedPassword, tel, ville });
        await user.save();
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.json({ token, refreshToken });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            const token = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshTokens.push(refreshToken);

            res.json({ token, refreshToken });
        });
    })(req, res, next);
};

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: 'http://localhost:4200/auth/error' }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect('http://localhost:4200/auth/error');

        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.redirect(`http://localhost:4200/auth/succss?token=${token}&refresh=${refreshToken}`);
    })(req, res, next);
};


const token = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        console.log('fffffffffffffffffffffffffffff');
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env.REFRESH_KEY_USER, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', user);

        const token = generateAccessTokenAfterRefresh(user);

        res.json({ token });
    });
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const page = async (req, res) => {

    try {
        let { page } = req.params;
        let startIndex = (page - 1) * 10;

        let users = await User.aggregate([

            {
                $match: {
                    archived: false
                }
            },
            { $sort: { date: -1 } },
            { $skip: startIndex },
            { $limit: 10 },
        ]
        );

        res.status(200).json({
            users: users,
            page: page,
            total: await User.countDocuments({ archived: false })
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const byId = async (req, res) => {

    try {

        let id = req.params.id;
        let result = await User.findOne({ _id: id, archived: false });
        result.password = '';
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const del = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await User.findByIdAndDelete({ _id: id });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const update = async (req, res, filename) => {

    try {
        let id = req.params.id;
        let data = req.body;

        if (filename.length > 0) {
            data.image = 'http://127.0.0.1:3626/user/' + filename;
        }

        if (data.password.length > 0) {
            let salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }

        await User.findByIdAndUpdate({ _id: id }, data);
        let user = await User.findById({ _id: id }, { fullname: 1, email: 1, tel: 1, image: 1 });
        let payload = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            tel: user.tel,
            image: user.image
        }
        let token = jwt.sign(payload, process.env.SECRET_KEY_USER);
        console.log(token);
        res.status(200).send({ token: token });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}


const archiveUser = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await User.findByIdAndUpdate({ _id: id }, { archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const restoreUser = async (req, res) => {

    try {

        let { id } = req.params;
        let result = await User.findByIdAndUpdate({ _id: id }, { archived: false });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const archiveListUser = async (req, res) => {

    try {

        let result = await User.find({ archived: true });
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User account not found' });
        }

        const randomBytes = crypto.lib.WordArray.random(20);
        const resetToken = crypto.enc.Hex.stringify(randomBytes);
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 7200000; // expire in 1 hour


        await user.save();

        const resetUrl = `${process.env.FRONT_URL}reset-password/${resetToken}`;
        // send email to user with resetUrl
        const emailObject = {
            destination: email,
            subject: 'Reset Password',
            content: `
            <!doctype html>
            <html lang="en-US">
            
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password</title>
                <meta name="description" content="Reset Password">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>
            
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                        requested to reset your password</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        We cannot simply send you your old password. A unique link to reset your
                                                        password has been generated for you. To reset your password, click the
                                                        following link and follow the instructions.
                                                    </p>
                                                    <a href="${resetUrl}"
                                                        style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                        Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                              
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>
            
            </html>`
        }

        sendEmail(emailObject, res)

        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gte: Date.now() }
        });


        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        let salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);
        user.resetToken = user.email;
        user.resetTokenExpiration = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    register,
    login,
    googleAuth,
    googleAuthCallback,
    createAdminAccount,
    getUser,
    page,
    byId,
    del,
    update,
    archiveUser,
    restoreUser,
    archiveListUser,
    forgotPassword,
    resetPassword,
    token
}