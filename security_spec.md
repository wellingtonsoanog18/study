# Security Specification: StudyFlow Pro / MetaEstudos

## 1. Data Invariants
1. System documents (`/system/{systemDocId}`) can only be written by authenticated administrators (`isAdmin()`). Students have read access.
2. User progress documents (`/users/{userId}`) can only be created, read, or updated by the authenticated owner (`request.auth.uid == userId`) or an admin.
3. Admin records (`/admins/{adminId}`) can only be created, updated, or deleted by existing admins.
4. Users cannot escalate their own privileges or spoof their UID during updates.
5. All IDs in paths must conform to `isValidId` (`size() <= 128 && matches('^[a-zA-Z0-9_\\-]+$')`).
6. Unauthenticated requests are denied access to user data.
7. Any write claiming admin status by email requires `request.auth.token.email_verified == true`.

## 2. The "Dirty Dozen" Payloads (Intended to Fail)
1. **Unauthenticated System Write**: Attempting to overwrite `/system/weeks_plan` with `{ "weeks": [] }` while `auth == null`.
2. **Student System Overwrite**: Authenticated regular student attempting to update `/system/weeks_plan`.
3. **Identity Spoofing on User Create**: User with UID `user_123` attempting to write to `/users/user_456`.
4. **Cross-User Progress Reading**: User `user_123` attempting to read `/users/user_456`.
5. **Cross-User Progress Tampering**: User `user_123` attempting to set checkboxes in `/users/user_456`.
6. **Path Injection / Junk ID**: Attacker attempting to create `/users/` with a 2000-character malicious path ID or non-alphanumeric chars.
7. **Email Spoofing without Verification**: Attacker sending token claiming email `wellington.nogueira18@gmail.com` but with `email_verified: false`.
8. **Admin Self-Promotion**: Regular user writing their own record into `/admins/{their_uid}`.
9. **System Collection Ghost Injection**: Attacker writing arbitrary subcollections under `/system/{systemDocId}/backdoor`.
10. **Denial-of-Wallet Payload**: Writing a payload with 500KB of junk fields into `/users/{uid}`.
11. **Malicious Official Materials Alteration**: Non-admin attempting to delete or overwrite `/system/official_materials`.
12. **Blanket Query Scraping**: Anonymous client querying all documents in `/users` without scoping by owner.
