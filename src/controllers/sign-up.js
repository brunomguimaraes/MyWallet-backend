import bcrypt from "bcrypt";
import { signUpSchema, emailAlrearyExist } from "../validations/signUp.js";
import connection from "../database/database.js";


const registerUser = async (req, res) => {
    const userData = req.body;
    const { name, email, password } = req.body;

    const { error } = signUpSchema.validate(userData);
    if (error) {
        return res.sendStatus(400);
    }


    try {
        if(await emailAlrearyExist(email)){
            return res.sendStatus(409);
        } 

        const passwordHash = bcrypt.hashSync(password, 10);

        await connection.query(
            `
                INSERT INTO users
                (name, email, password)
                VALUES ($1, $2, $3)
            `,
            [name, email, passwordHash]
        );

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

export { registerUser };
