import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'User Not Authorized' })
    }

    try {

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export default userAuth;