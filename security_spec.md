# Security Specification: GeoExplore LKPD Detektif Citra

## 1. Data Invariants
1. Groups are strictly constrained to identifiers `group1` through `group6`.
2. Group progress must be between 0 and 100 percent.
3. Group status transitions can only be: `not_started` -> `in_progress` -> `submitted` -> `graded` or `revision`.
4. Only authenticated teachers (Admin) can write scores or upload/modify global class settings.
5. Scores are strictly bounded:
   - `objectIdentification` <= 30
   - `visualReasoning` <= 25
   - `completeness` <= 20
   - `presentation` <= 15
   - `reflection` <= 10
   - `totalScore` <= 100
6. Students can only read their own group's data and score, without tampering with teacher scores or other groups' data.
7. Immortality invariant: A student cannot wipe out another group's ID or change groupNumber to an invalid value.

## 2. The "Dirty Dozen" Attack Payloads
1. **Ghost Field in Group Update**: Student sends `{ groupNumber: "1", unauthorizedPrivilege: true }`.
2. **Invalid Group ID Poisoning**: Attacker attempts write to `/groups/group9999999999999999999999999999999`.
3. **Score Injection by Student**: Non-admin attempts write to `/scores/group1` with `{ totalScore: 100 }`.
4. **Score Overflow Attack**: Admin sends `{ objectIdentification: 50, totalScore: 120 }`.
5. **Score Negative Number**: Non-valid score with `{ totalScore: -20 }`.
6. **Group Status Bypass**: Direct attempt to write `status: "graded"` from unauthenticated student client.
7. **Cross-Group Snooping**: Reading another group's private notes when restricted.
8. **Settings Tampering**: Non-admin student attempts to overwrite `/settings/default` image URLs.
9. **Massive Payload Denial of Wallet**: Injecting 5MB string into `groupName`.
10. **Array Explosion Attack**: Injecting 500 members in `members` array.
11. **Spoofed Teacher Email**: Non-verified email trying to claim admin role.
12. **Malicious Revision Hijack**: Attempting to alter a graded document without teacher revision unlock.

## 3. Test Runner Coverage
The security rules validate:
- `isValidId(groupId)` matches standard format.
- `isAdmin()` verifies teacher credentials against `faradilashafa@gmail.com` with `email_verified == true`.
- Scores can only be created/updated if `isAdmin()`.
- Group updates from students respect boundary checks and size restrictions.
