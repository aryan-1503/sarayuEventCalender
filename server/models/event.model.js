import {poolWithDb} from "../utils/db.js";

export const createEvent = async (eventname, description, eventdate, userid)=> {
    const res = await poolWithDb.query(
        'INSERT INTO events (eventname, description, eventdate, userid) VALUES ($1, $2, $3, $4) RETURNING *',
        [eventname, description, eventdate, userid]
    )

    return res.rows[0];
};

export const findEventsByUser = async (userid) => {
    const res = await poolWithDb.query(
        'SELECT * FROM events WHERE userid = $1',
        [userid]
    )

    return res.rows;
}

export const findEventById = async (eventid) => {
    const res = await poolWithDb.query(
        'SELECT * FROM events WHERE eventid = $1',
        [eventid]
    )
    return res.rows[0];
}

export const updateEventById = async (eventid, eventData) => {
    const updates = [];
    const values = [];

    // Check and prepare updates based on provided fields
    if (eventData.eventname !== undefined) {
        updates.push(`eventname = $${updates.length + 1}`);
        values.push(eventData.eventname);
    }
    if (eventData.description !== undefined) {
        updates.push(`description = $${updates.length + 1}`);
        values.push(eventData.description);
    }
    if (eventData.eventdate !== undefined) {
        updates.push(`eventdate = $${updates.length + 1}`);
        values.push(eventData.eventdate);
    }

    // If no fields to update, throw an error
    if (updates.length === 0) {
        throw new Error("No fields provided to update");
    }

    // Construct the final query
    const query = `
        UPDATE events
        SET ${updates.join(', ')}
        WHERE eventid = $${updates.length + 1}
        RETURNING *;
    `;

    // Add eventid as the last parameter
    values.push(eventid);

    const res = await poolWithDb.query(query, values);
    return res.rows[0];
}

export const updateShouldRemind = async (eventid) => {
    const res = await poolWithDb.query(
        'UPDATE events SET shouldremind=$1 WHERE eventid=$2 RETURNING *;',
        [true, eventid]
    )
}
export const deleteEventById = async (eventid) => {
    const res = await poolWithDb.query(
        'DELETE FROM events WHERE eventid = $1',
        [eventid]
    );
}