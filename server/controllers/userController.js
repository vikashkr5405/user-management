import User from "../models/User.js";

const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            total,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
export default {getUsers}