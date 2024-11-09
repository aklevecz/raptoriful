const tables = {
	rsvp: 'raptor_rsvps',
	raptor: 'raptors'
};

const db = () => {
	return {
		/** @param {*} db @param {{phoneNumber:string}} raptor*/
		createRaptor: async (db, raptor) => {
			const randomColor = Math.floor(Math.random() * 16777215).toString(16);
			return await db
				.prepare(`INSERT INTO ${tables.raptor} (phone_number, color) VALUES (?, ?)`)
				.bind(raptor.phoneNumber, randomColor)
				.run();
		},
		/** @param {*} db @param {string} eventName*/
		getAllRsvps: async (db, eventName) => {
			return await db
				.prepare(`SELECT * FROM ${tables.rsvp} WHERE event_name = ?`)
				.bind(eventName)
				.all();
		},
		/** @param {*} db @param {{phoneNumber:string}} params*/
		getRsvp: async (db, { phoneNumber }) => {
			return await db
				.prepare(`SELECT * FROM ${tables.rsvp} WHERE phone_number = ?`)
				.bind(phoneNumber)
				.run();
		},
		/** @param {*} db @param {{phoneNumber: string, eventName: string}} rsvp */
		createRsvp: async (db, rsvp) => {
			return await db
				.prepare(`INSERT INTO ${tables.rsvp} (phone_number, event_name) VALUES (?, ?)`)
				.bind(rsvp.phoneNumber, rsvp.eventName)
				.run();
		},
        /** @param {*} db @param {{phoneNumber: string, eventName: string}} rsvp */
        deleteRsvp: async (db, rsvp) => {
            return await db
                .prepare(`DELETE FROM ${tables.rsvp} WHERE phone_number = ? AND event_name = ?`)
                .bind(rsvp.phoneNumber, rsvp.eventName)
                .run();
        },
		/**
		 * @param {*} db
		 * @param {string} eventName
		 */
		getRsvpsAndRaptors: async (db, eventName) => {
            return await db.prepare(`
            SELECT rsvps.phone_number, rsvps.event_name, raptors.color 
            FROM ${tables.rsvp} AS rsvps
            JOIN ${tables.raptor} AS raptors ON rsvps.phone_number = raptors.phone_number
            WHERE rsvps.event_name = ?
        `).bind(eventName).all()
		}
	};
};

export default db();
