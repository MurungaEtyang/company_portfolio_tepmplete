const lastSeen = async (userId) => {
    const query = {
        text: `
            SELECT last_seen
            FROM users
            WHERE id = $1
        `,
        values: [userId],
    };

    try {
        const result = await pool.query(query);
        const lastSeenDate = result.rows[0].last_seen;
        const now = new Date();

        const diff = now - lastSeenDate;
        const minutes = Math.floor(diff / 1000 / 60);

        if (minutes < 5) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if user is online:', error);
        return false;
    }
};

module.exports = lastSeen;