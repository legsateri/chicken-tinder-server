////////////////////////////////////////////////////////////////////////////////
const xss = require("xss")
////////////////////////////////////////////////////////////////////////////////

const GroupsService = {
    getAllGroups(knex) {
        return knex
            .select("*")
            .from("groups");
    },

    insertGroups(db, newGroup) {
        return db
            .insert(newGroup)
            .into("groups")
            .returning("*")
            .then(([group]) => group);
    },

    serializeGroup(group) {
        return {
            group_id: group.group_id,
            member_one: group.member_one,
            member_two: group.member_two,
            past_match_1: group.past_match_1,
            past_match_2: group.past_match_2,
            past_match_3: group.past_match_3,
            past_match_4: group.past_match_4,
            past_match_5: group.past_match_5,
            past_match_6: group.past_match_6,
            past_match_7: group.past_match_7,
            past_match_8: group.past_match_8,
            past_match_9: group.past_match_9,
            past_match_10: group.past_match_10
        };
    },

    getById(knex, group_id) {
        return knex("groups")
            .where("group_id", group_id)
            .first();
    },

    deleteGroups(knex, group_id) {
        return knex("groups")
            .where({ group_id })
            .delete();
    },

    updateGroup(knex, group_id, updatedGroup) {
        return knex("groups")
            .where({ group_id })
            .update(updatedGroup);
    },

    getGroupsByMemberOne(db, group_id, member_one) {
        return db
            .from("groups AS group")
            .select(
                "group.group_id",
                "group.member_one",
                "group.member_two",
                "user.email",
                "user.first_name",
                "user.last_name"
            )
            .where("group.member_one", member_one)
            .leftJoin(
                "users AS user",
                "group.member_one",
                "group.member_two",
                "user.email",
                "user.first_name",
                "user.last_name"
            )
    },

    getGroupsByMemberTwo(db, group_id, member_two) {
        return db
            .from("groups AS group")
            .select(
                "group.group_id",
                "group.member_one",
                "group.member_two",
                "user.email",
                "user.first_name",
                "user.last_name"
            )
            .where("group.member_two", member_two)
            .leftJoin(
                "users AS user",
                "group.member_one",
                "group.member_two",
                "user.email",
                "user.first_name",
                "user.last_name"
            )
    },

    serializeGroupWithUser(group) {
        return {
            group_id: group.group_id,
            member_one: group.member_one,
            member_two: group.member_two,
            email: group.email,
            first_name: group.first_name,
            last_name: group.last_name
        }
    }
};

module.exports = GroupsService;