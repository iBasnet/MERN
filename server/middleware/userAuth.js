import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'User Not Authorized' })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body.userid = tokenDecode.id;
        }
        else {
            return res.json({ success: false, message: 'User Not Authorized. Login Again!' })
        }

        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default userAuth;