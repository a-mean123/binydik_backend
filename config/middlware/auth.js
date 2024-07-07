const jwt = require('jsonwebtoken');

const blacklist = new Set();


const checkBlackList = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]

    if (token) {
        if (blacklist.has(token)) {

            return res.status(401).json({ message: 'Token invalidated. Please log in again.' });
        }
        // Token is not in the blacklist; continue to the next middleware or route handler

    } else {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

const logoutUser = (req, res) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        blacklist.add(token);
        res.status(200).json({ message: 'Logged out successfully' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}


const verifyTokenAdmin = async (req, res, next) => {

    // try {
    //     await checkBlackList(req, res);
    //     const decoded = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_ADMIN);
    //     req.admin = decoded;
    //     // if (decoded.exp <= Date.now() / 1000) {
    //     //     return res.status(400).send('invalid token');
    //     // }
    next();
    // } catch (err) {
    //     console.log(err);
    //     res.status(400).send('invalid token');
    // }

}

const verifyTokenUser = async (req, res, next) => {

    try {
        console.log(req.headers)
        const decoded = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY_USER);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).send('invalid token');
    }

}

const verifyTokenAdminAndUser = async (req, res, next) => {
    // try {
    //     await checkBlackList(req, res);
    //     const token = req.headers.authorization.split(' ')[1];

    //     jwt.verify(token, process.env.SECRET_KEY_ADMIN, (err, decoded) => {
    //         if (err) {
    //             jwt.verify(token, process.env.SECRET_KEY_USER, (err, decoded) => {
    //                 if (err) {
    //                     return res.status(401).json({ message: 'Invalid token' });
    //                 } else {

    //                     req.user = decoded;
    next();

    //                 }
    //             });
    //         } else {
    //             req.admin = decoded;

    //             next();
    //         }
    //     });

    // } catch (err) {
    //     res.status(401).send('invalid token');
    // }

}




const testProtectionAdmin = (req, res) => {
    try {
        res.status(200).send({ result: `welcome ${req.admin.fullname}` });
    } catch (error) {
        res.status(401).send("invalid token");
    }
}

const testProtectionUser = (req, res) => {
    try {
        res.status(200).send({ result: `welcome ${req.user.fullname}` });
    } catch (error) {
        res.status(401).send("invalid token");
    }
}

module.exports = {
    verifyTokenUser,
    testProtectionUser,
    verifyTokenAdminAndUser,
    verifyTokenAdmin,
    testProtectionAdmin,
    logoutUser
}