////////////////////////////////////////////////////////////////////////////////
const path = require("path");
const express = require("express");
////////////////////////////////////////////////////////////////////////////////
const GroupsService = require("./groups-service");
const { requireAuth } = require("../middleware/jwt-auth");
////////////////////////////////////////////////////////////////////////////////
const groupsRouter = express.Router();
const jsonParser = express.json();
////////////////////////////////////////////////////////////////////////////////

// FIXME: Add ability to exclusively display groups based on user. 

groupsRouter
    .route("/")

    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        GroupsService.getAllGroups(knexInstance)
            .then(groups => {
                res.json(groups);
            })
            .catch(next);
    })

    .post(requireAuth, jsonParser, (req, res, next) => {
        const { member_two } = req.body;
        const newGroup = { member_two };

        for (const [key, value] of Object.entries(newGroup))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing ${key} in request.` }
                });

        newGroup.member_one = req.user.email

        GroupsService.insertGroups(
            req.app.get("db"),
            newGroup
        )
            .then(group => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${group.group_id}`))
                    .json(GroupsService.serializeGroup(group));
            })
            .catch(next);
    });

groupsRouter
    .route("/user")

    .all(requireAuth)

    .get((req, res, next) => {
        for (let i = 0; i < groups.length; i++) {
            if (member_one === req.user.user_id) {
                GroupsService.getGroupsByUser(
                    req.app.get("db"),
                    member_one
                )
                    .then(groups => {
                        res.json(groups.map(GroupsService.serializeGroupWithUser));
                    })
                    .catch(next)
            } else if (member_two === req.user.user_id) {
                GroupsService.getGroupsByUser(
                    req.app.get("db"),
                    member_two
                )
                    .then(groups => {
                        res.json(groups.map(GroupsService.serializeGroupWithUser));
                    })
                    .catch(next);
            };
        };
    });

groupsRouter
    .route("/:group_id")

    .all(requireAuth)

    .all((req, res, next) => {
        GroupsService.getById(
            req.app.get("db"),
            req.params.group_id
        )
            .then(group => {
                if (!group) {
                    return res.status(404).json({
                        error: { message: "Group does not exist." }
                    });
                };
                res.group = group;
                next();
            })
            .catch(next);
    })

    .get((req, res, next) => {
        res.json(res.group);
    })

    .delete((req, res, next) => {
        GroupsService.deleteGroups(
            req.app.get("db"),
            req.params.group_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })

    .patch(jsonParser, (req, res, next) => {
        const { past_match_1, past_match_2, past_match_3, past_match_4, past_match_5, past_match_6, past_match_7, past_match_8, past_match_9, past_match_10 } = req.body;
        updatedGroup = { past_match_1, past_match_2, past_match_3, past_match_4, past_match_5, past_match_6, past_match_7, past_match_8, past_match_9, past_match_10 };

        GroupsService.updateGroup(
            req.app.get("db"),
            req.params.group_id,
            updatedGroup
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = groupsRouter;