# Payments tests

## Testdata

- [ ] user AAA0 is not in EP
- [ ] Create user AAA1 without account
- [ ] Create user AAA2 with account
- [ ] user BBB0 is not in EP
- [ ] Create user BBB1 without account
- [ ] Create user BBB2 with account

## Script (A sends money to B)

- [ ] AAA0 => BBB0, € 100

  - [ ] email send to AAA0
  - [ ] transaction created with status REJECTED

- [ ] AAA1 => BBB0, € 100

  - [ ] email send to A
  - [ ] transaction created with status REJECTED

- [ ] AAA2 (€50) => BBB0, € 100

  - [ ] email send to A
  - [ ] transaction created with status REJECTED

- [ ] AAA2 (€500) => BANK, €100

  - [ ] email send to A
  - [ ] transaction created with status COMPLETED
  - [ ] created transaction details (1 entry because there is no details for the bank)

- [ ] AAA2(€500) => BBB0, € 100

  - [ ] email send to A
  - [ ] transaction created with status REJECTED

- [ ] AAA2(€500) => BBB1, €100

  - [ ] email send to A
  - [ ] transaction created with status REJECTED

- [ ] AAA2(€500) => BBB2(100$), €100

  - [ ] email send to B, cc to A
  - [ ] transaction created with status COMPLETED
  - [ ] created transaction details (2 entrues, 1 for A and 1 for B)
