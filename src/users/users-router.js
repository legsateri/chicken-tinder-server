////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const path = require("path");
////////////////////////////////////////////////////////////////////////////////
const UsersService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");
////////////////////////////////////////////////////////////////////////////////
const usersRouter = express.Router();
const jsonParser = express.json();
////////////////////////////////////////////////////////////////////////////////

usersRouter
    .post("/", jsonParser, (req, res, next) => {
        const { password, email, first_name, last_name } = req.body;

        for (const field of ["first_name", "last_name", "email", "password"])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing ${field} in request body.`
                });

        const passwordError = UsersService.validatePassword(password);

        if (passwordError)
            return res.status(400).json({ error: passwordError });

        UsersService.hasUserWithEmail(
            req.app.get("db"),
            email
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: `An account with this email already exists.` });

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            password: hashedPassword,
                            first_name,
                            last_name,
                            date_created: "now()"
                        };

                        return UsersService.insertUser(
                            req.app.get("db"),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
                                    .json(UsersService.serializeUser(user));
                            });
                    });
            })
            .catch(next);
    });

usersRouter
    .route("/:user_id")

    .all(requireAuth)

    .all((req, res, next) => {
        UsersService.getById(
            req.app.get("db"),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: "User does not exist." }
                    });
                };
                res.user = user;
                next();
            })
            .catch(next);
    })

    .get((req, res, next) => {
        res.json(res.user);
    })

    .patch(jsonParser, (req, res, next) => {
        const { 
            yum_1, yum_2, yum_3, yum_4, yum_5, yum_6, yum_7, yum_8, yum_9, yum_10,
            yum_11, yum_12, yum_13, yum_14, yum_15, yum_16, yum_17, yum_18, yum_19, yum_20,
            yum_21, yum_22, yum_23, yum_24, yum_25, yum_26, yum_27, yum_28, yum_29, yum_30,
            yum_31, yum_32, yum_33, yum_34, yum_35, yum_36, yum_37, yum_38, yum_39, yum_40,
            yum_41, yum_42, yum_43, yum_44, yum_45, yum_46, yum_47, yum_48, yum_49, yum_50,
        } = req.body;

        updatedUser = { 
            yum_1, yum_2, yum_3, yum_4, yum_5, yum_6, yum_7, yum_8, yum_9, yum_10,
            yum_11, yum_12, yum_13, yum_14, yum_15, yum_16, yum_17, yum_18, yum_19, yum_20,
            yum_21, yum_22, yum_23, yum_24, yum_25, yum_26, yum_27, yum_28, yum_29, yum_30,
            yum_31, yum_32, yum_33, yum_34, yum_35, yum_36, yum_37, yum_38, yum_39, yum_40,
            yum_41, yum_42, yum_43, yum_44, yum_45, yum_46, yum_47, yum_48, yum_49, yum_50,
        };

        updatedUser.user_id = req.user.user_id;

        UsersService.updateUser(
            req.app.get("db"),
            req.params.user_id,
            updatedUser
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = usersRouter;