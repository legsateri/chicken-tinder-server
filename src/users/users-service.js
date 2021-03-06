////////////////////////////////////////////////////////////////////////////////
const xss = require("xss");
const bcrypt = require("bcryptjs");
////////////////////////////////////////////////////////////////////////////////

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    getAllUsers(knex) {
        return knex
            .select("*")
            .from("users");
    },

    hasUserWithEmail(db, email) {
        return db("users")
            .where({ email })
            .first()
            .then(user => !!user);
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into("users")
            .returning("*")
            .then(([user]) => user);
    },

    validatePassword(password) {
        if (password.length < 8) {
            return "Password must be longer than 8 characters."
        }
        if (password.length > 72) {
            return "Password must be less than 72 characters."
        }
        if (password.startsWith(" ") || password.endsWith(" ")) {
            return "Password must not start or end with a space."
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return "Password must contain one upper case, lower case, number and special character."
        };

        return null;
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },

    serializeUser(user) {
        return {
            user_id: user.user_id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            email: xss(user.email),
            date_created: new Date(user.date_created)
        };
    },

    getById(knex, user_id) {
        return knex("users")
            .where("user_id", user_id)
            .first();
    },

    updateUser(knex, user_id, updatedUser) {
        return knex("users")
            .where({ user_id })
            .update(updatedUser);
    },
};

module.exports = UsersService;