import * as usersService from "./user.service.js";

export async function userLogin(req, res) {
    try {
        const { name } = req.body;
        const newUser = await usersService.newUser(name);

        res.status(201).json({
            "message": "User Login Successful",
            "userID": newUser.userID,
            "user": newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "message": "Error in User Login",
            "userID": null,
            "error" : error
        });
    }
}
