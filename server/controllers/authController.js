import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const htmlTemplate =
            `
            <div style="text-align: center;">
                <h1>Thanks for registering, ${name}! 😊</h1>
                <br>
                <p>Your account has been created with the email address:</p>
                <h1>${email}</h1>
                <br>
                <i>Discover more from us.</i>
                <div style="margin: 1rem 0;">
                    <a href="https://youtu.be/dQw4w9WgXcQ"><img style="max-width: 2rem;"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/YouTube_social_red_circle_%282017%29.svg/1200px-YouTube_social_red_circle_%282017%29.svg.png"></a>
                    <a href="https://youtu.be/dQw4w9WgXcQ"><img style="max-width: 2rem;"
                            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-color-icon.png"></a>
                    <a href="https://youtu.be/dQw4w9WgXcQ"><img style="max-width: 2rem;"
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/220px-Reddit_Logo_Icon.svg.png"></a>
                    <a href="https://youtu.be/dQw4w9WgXcQ"><img style="max-width: 2rem;"
                            src="https://daily-now-res.cloudinary.com/image/upload/v1614088267/landing/Daily.dev_logo.png"></a>
                </div>
            </div>
            `

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Basnetium™ 🙏',
            // text: `Thanks for registering, ${name}! Your account has been created with the email address: ${email}. Discover more from us.`
            html: htmlTemplate
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' })
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: 'Logged out' });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}