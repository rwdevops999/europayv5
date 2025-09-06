# Payments tests

## Testdata

- [ ] user AAA0 is not in EP
- [ ] Create user AAA1 without account
- [ ] Create user AAA2 with account
- [ ] user BBB0 is not in EP
- [ ] Create user BBB1 without account
- [ ] Create user BBB2 with account

## Script (A sends money to B)

- [x] AAA0(email) => BBB0, € 100

  - [ ] email send to AAA0
  - [x] transaction created with status REJECTED

- [x] AAA1(username) => BBB0, € 100

  - [ ] email send to A
  - [x] transaction created with status REJECTED

- [x] AAA2 (username, €50) => BBB0, € 100

  - [ ] email send to A
  - [x] transaction created with status REJECTED

- [x] AAA2 (email, €500) => BANK, €100

  - [ ] email send to A
  - [ ] transaction created with status COMPLETED
  - [x] created transaction details (2 entries wherefrom one for the bank)

- [x] AAA2(username, €500) => BBB0(email), € 100

  - [x] email send to A
  - [x] transaction created with status REJECTED

- [x] AAA2(username, €500) => BBB1(username), €100

  - [ ] email send to A
  - [x] transaction created with status REJECTED

- [ ] AAA2(email, €500) => BBB2(email, 100$), €100

  - [ ] email send to B, cc to A
  - [x] transaction created with status COMPLETED
  - [x] created transaction details (2 entrues, 1 for A and 1 for B)
