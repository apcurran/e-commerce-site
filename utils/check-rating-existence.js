export function checkRatingExistence(userId, arr) {
    return arr.some((ratingObj) => ratingObj.user_id === userId);
}
