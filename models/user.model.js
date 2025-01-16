import { db } from '../database/conexion_db.js';
//CREATE
const createUser = async ({email, password, role}) => {
    const query = {
        text: `
        INSERT INTO admin.users (email, password, role)
        VALUES ($1, $2, $3) 
        RETURNING email, password, role
        `,
        values: [email, password, role]
    };

    const { rows } = await db.query(query);
    return rows[0];
}
//READ
const showUser = async () => {
    const result = {
        text:`
        SELECT * FROM admin.users`
    };
    const { rows } = await db.query(result);
    return rows
}

const findOneByEmail = async (email) => {
    const query = {
        text:`
        SELECT * FROM admin.users
        WHERE email = $1
        `,
        values: [email]
    }
    const {rows} = await db.query(query, [email]);
    return rows[0];
}


export const UserModel = {
    createUser,
    showUser,
    findOneByEmail
}