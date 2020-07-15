////////////////////////////////////////////////////////////////////////////////
const xss = require("xss")
////////////////////////////////////////////////////////////////////////////////

// FIXME: Add ability to exclusively display groups based on user. 

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
};

module.exports = GroupsService;