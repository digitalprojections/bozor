# Registration local Docker verification

Date: 2026-10-21 (Japan time). App version: 1.0.1.

## Environment

Tested the existing `bozor` Compose project and `bozor-app` container, updated from the production Dockerfile. PostgreSQL continued to use `bozor_local_test`; existing PostgreSQL, Redis, Caddy, and storage volumes were retained. A temporary stack created during preparation was removed. No public deployment was performed.

The app was exposed at `http://127.0.0.1:8087` for testing. Mail used the array transport, so no real emails were sent. The database and previous application code were backed up under ignored `test-results/` before the update.

## Browser journeys on the Docker-served app

| Check | Result |
| --- | --- |
| ASCII and full-width postal-code input | Passed; 1600023 filled 東京都 / 新宿区 / 西新宿 |
| Multiple matches | Passed; 0790177 displayed an area selector |
| Change selected area | Passed; switching selection changed the town |
| Manual edits while lookup was pending | Passed; city, street number, and building edits were retained |
| No address match | Passed; 0000000 showed manual-entry guidance |
| Postal-service failure | Passed with the external lookup URL temporarily blocked through browser developer controls |
| Retry after service failure | Passed after removing the temporary block |
| Complete code changed to an incomplete code | Passed; cancelled lookup remained idle and did not fill an address |
| Password confirmation mismatch | Passed; visible server validation, address retained, no account created |
| Successful registration with autofill | Passed; reached email verification and saved the exact address/contact data |
| Profile restoration | Passed; profile settings displayed the saved registration address |
| Logout and login | Passed; the synthetic account authenticated again |
| Duplicate email | Passed; rejected without creating another account |
| Registration during postal-service failure | Passed with a manually entered address |
| Persisted data and password hashes | Passed for both synthetic accounts via scripts/verify-registration-docker.php |
| English, Japanese, Uzbek, Russian | Registration labels and new guidance inspected |
| Portrait 390 × 844 and landscape 844 × 390 | Passed; no horizontal overflow and phone follows both address fields |
| Browser JavaScript errors | None reported during the journeys |
| Test-data cleanup | Exactly two synthetic accounts removed; zero matching QA accounts remained |

External email delivery and Google OAuth were outside the changed registration-address features and were not exercised. Production, physical Android devices, and public deployment were not tested.

## Repeatable tools

- `scripts/test-registration-docker.ps1 -Action Status` inspects the existing stack.
- `scripts/test-registration-docker.ps1 -Action Test` installs locked test tooling if needed, prepares GD image codecs, runs the full backend suite in the existing container, and saves JUnit output. The existing app container must be running (`docker start bozor-app`).
- `scripts/test-registration-docker.ps1 -Action Update` updates only its app service, retaining its known local database and existing volumes. It expects the locally built `bozor-app-local:1.0.1` image and refuses other database names.
- Copy `scripts/verify-registration-docker.php` into the existing app container after repeating the two synthetic browser journeys. Run it with `--cleanup` after logging out to verify and remove only those synthetic accounts.
- `npm run test:registration` runs eight focused frontend helper tests, previously passed together with TypeScript, lint, and production build checks.

## Broader regression checks

The first full backend run completed 148 tests / 966 assertions with three errors, one failure, and one skipped test: two filesystem errors came from a read-only test mount, the avatar upload test required the missing PHP GD extension, and the sitemap XML declaration was interpreted as a PHP short tag. These are separate from the registration journeys above.

The final follow-up ran directly inside the existing app container after installing the locked Composer development dependencies and GD with PNG/JPEG/WebP/font support. Its test process used in-memory SQLite, array cache/sessions/mail, synchronous queues, separate cache paths, and `short_open_tag=0`. These process settings did not modify the running web application's database/session/mail configuration. GD and test dependencies were added only to the local container; they are prepared on demand by the test script and are not included in the committed production image configuration.

Final result: **148 tests, 1,051 assertions, zero errors, zero failures, zero skips**, PHP 8.4.26, approximately five seconds. JUnit evidence is saved at ignored `test-results/registration-regression.xml`.

The first run's sitemap error is avoided in the test process by disabling PHP short tags. The production Dockerfile's PHP defaults were not changed by this registration task; this is a separate environment consideration for sitemap testing.

The test browser was closed and its viewport/network overrides were reset. The existing app service was stopped after testing, per the project's localhost testing instructions; PostgreSQL, Redis, and Caddy were retained.
