import {poolWithDb} from "../utils/db.js";


export const findUserByEmail = async (email) => {
    const res = await poolWithDb.query('SELECT * FROM users WHERE email = $1',[email]);
    // console.log("RES of findUserByEmail : ", res)
    return res.rows[0];
}

export const findUserById = async (id) => {
    const res = await poolWithDb.query('SELECT userid, username,email, isverified FROM users WHERE userid = $1',[id]);
    // console.log("RES of findUserByEmail : ", res)
    return res.rows[0];
}

export const createUser = async (username, email, password, verificationCode) => {
    const res = await poolWithDb.query(
        'INSERT INTO users (username, email, password, verificationCode) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, password, verificationCode]
    );
    // console.log("RES of createUser : ", res);
    return res.rows[0];
};

export const getUserVerificationCode = async (email) => {
    const res = await poolWithDb.query(
        'SELECT verificationCode from user WHERE email = $1',
        [email]
    );

    return res.rows[0];
}

export const updateUserVerification = async (userId, isVerified, verificationCode, attempts) => {
    const res = await poolWithDb.query(
        'UPDATE users SET isVerified = $1, verificationCode = $2, attempts = $3 WHERE userId = $4 RETURNING *',
        [isVerified, verificationCode, attempts, userId]
    );
    return res.rows[0];
};

export const deleteUserByEmail = async (email) => {
    await poolWithDb.query('DELETE FROM users WHERE email = $1', [email]);
};

export const incrementUserAttempts = async (userId) => {
    await poolWithDb.query('UPDATE users SET attempts = attempts + 1 WHERE userId = $1', [userId]);
};