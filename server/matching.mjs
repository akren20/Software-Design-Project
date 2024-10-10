// server/matcher.mjs

/**
 * Matches volunteers to activities based on their profile data.
 * @param {Array} volunteers - List of volunteer profiles.
 * @param {Array} activities - List of activities.
 * @returns {Array} - List of matches.
 */
export function matchVolunteersToActivities(volunteers, activities) {
    const matches = [];

    volunteers.forEach(volunteer => {
        activities.forEach(activity => {
            if (isMatch(volunteer, activity)) {
                matches.push({
                    volunteer: volunteer.name,
                    activity: activity.name
                });
            }
        });
    });

    return matches;
}

/**
 * Checks if a volunteer matches an activity.
 * @param {Object} volunteer - Volunteer profile.
 * @param {Object} activity - Activity details.
 * @returns {boolean} - True if the volunteer matches the activity.
 */
function isMatch(volunteer, activity) {
    // Example matching logic: match based on required skills
    return activity.requiredSkills.every(skill => volunteer.skills.includes(skill));
}