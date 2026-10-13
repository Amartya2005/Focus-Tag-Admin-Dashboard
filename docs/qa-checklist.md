# QA Checklist

## Dashboard smoke tests
- [ ] Dashboard loads without console errors.
- [ ] Navigation links lead to the expected views.
- [ ] Loading, empty, and error states are understandable.
- [ ] Forms validate required fields and malformed input.
- [ ] API failures are surfaced without exposing sensitive details.
- [ ] Layout remains usable on narrow screens.
- [ ] Authentication and role restrictions are checked for protected actions.
- [ ] No credentials or personal data are included in logs or test fixtures.

Record the tested commit, browser, environment, and actual outcomes when running this checklist.