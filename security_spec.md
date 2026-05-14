# Security Specification for OficioCerca

## 1. Data Invariants
- A worker profile must have a valid `userId` matching the authenticated user.
- A review must have a `workerId` of a valid worker and a `clientId` of the current user.
- Ratings must be between 1 and 5.
- Users cannot modify the `rating` or `ratingCount` fields of their own profile (this should ideally be handled by a Cloud Function for total security, but we enforce immutability in rules for now).

## 2. The Dirty Dozen (Attacks)
1. **Identity Spoofing**: Authenticated user 'A' tries to create a profile for 'B'. (Blocked by `isOwner(userId)`)
2. **Shadow Field Injection**: User tries to add `isAdmin: true` to their profile. (Blocked by schema validation `isValidProfile` + `affectedKeys`)
3. **Rating Fraud**: User tries to set their own rating to 5.0 without reviews. (Blocked by `update` constraints)
4. **ID Poisoning**: User tries to use a 2MB string as a `userId`. (Blocked by `isValidId` and size checks)
5. **Review Hijacking**: User 'A' tries to edit a review written by 'B'. (Blocked by `isOwner(incoming().clientId)`)
6. **Cross-Worker Review**: User tries to post a review for Worker 'X' inside Worker 'Y's collection. (Blocked by `incoming().workerId == userId` check)
7. **Timestamp Spoofing**: User tries to set `createdAt` to a date in the past. (Blocked by `request.time` check)
8. **Resource Exhaustion**: User tries to upload 1000 professions in an array. (Should be limited by rule size/count checks)
9. **Blanket Read Exposure**: Unauthenticated user tries to list all emails. (Emails are not stored/exposed unless public)
10. **State Skipping**: User tries to update profile without entering a name. (Blocked by `isValidProfile` required fields)
11. **PII Leakage**: Trying to read sensitive parts of a profile. (Profile is public by design, but phone is controlled by user)
12. **Malicious Comment**: Posting a 1MB string in a review. (Blocked by size checks in `isValidReview`)

## 3. Red Team Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|------------|-------------------|-------------------|-------------------|
| Profiles   | Protected (isOwner) | Protected (isValid) | Protected (size) |
| Reviews    | Protected (isOwner) | Protected (isValid) | Protected (size) |
