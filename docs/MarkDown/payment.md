# An user A wants to pay B

- [x] User A is not a member of Europay

  - No payment can be done => NO TRANSACTION
  - email to A (if email)

- [x] User A is a member but has no account

  - No payment can be done => NO TRANSACTION
  - email to A (email from profile)

- [ ] User A is a member and has an account but not enough money

  - No payment is done => TRANSACTION REJECTED (CASE A)
  - email to A (email from profile)

- [ ] User A is OK (OK = member with account and enough provisioning)

## B is a bank

- Payment is executed => TRANSACTION COMPLETED (isBankAccount) (CASE B)
- email to A (email from profile)

## B is not a bank

- [x] User B is not a member of Europay

  - No payment is done => TRANSACTION REJECTED (CASE C)
  - email to A (email from profile)

- [x] User B is a member but has no account

  - No payment is done => TRANSACION REJECTED (CASE D)
  - email to A and B (email from profile)

- [ ] User B is OK

  - Payment is executed => TRANSACTION COMPLETED (CASE E)
  - email to A and B (email from profile)

  ## Transaction data

| field                 | A   | B   | C   | D   | E   |
| --------------------- | --- | --- | --- | --- | --- |
| transactionid         | x   | x   | x   | x   | x   |
| status                | R   | C   | R   | R   | C   |
| statusMessage         | x   | E   | x   | x   | E   |
| isBankTransaction     | N   | Y   | N   | N   | N   |
| senderAmount          | x   | x   | x   | x   | x   |
| receiverAmount        | o   | x   | o   | x   | x   |
| senderAccountAmount   | x   | x   | x   | x   | x   |
| receiverAccountAmount | o   | o   | o   | o   | x   |
| senderAccount         | x   | x   | x   | x   | x   |
| senderAccountId       | x   | x   | x   | x   | x   |
| receiverAccount       | o   | o   | o   | o   | x   |
| receiverAccountId     | o   | o   | o   | o   | x   |
| sender                | x   | x   | x   | x   | x   |
| receiver              | x   | x   | x   | x   | x   |
| message               | x   | x   | x   | x   | x   |
| createDate            | x   | x   | x   | x   | x   |
| updateDate            | x   | x   | x   | x   | x   |

### TEST (Using test application)

1. Create USER AAA1 (without account)
2. Create USER BBB1 (without account)

3. Create USER AAA2 (with account, value € 100)
4. Create USER BBB2 (with account, value € 0)

AAA0 => BBB2 (€ 5) NO TRANSACTION, EMAIL TO AAA0
AAA1 => BBB2 (€ 7) NO TRANSACTION, EMAIL TO AAA1

AAA2 => BBB2 (€ 125) REJECTED TRANSACTION (insufficient amount) EMAIL TO AAA2, BBB2

AAA2 => BBB0 (€ 75) REJECTED TRANSACTION (R unknown) EMAIL TO AAA2
AAA2 => BBB1 (€ 75) REJECTED TRANSACTION (R no account) EMAIL TO AAA2, BBB1
AAA2 => BBB2 (€ 75) COMPLETED TRANSACTION (R no account) EMAIL TO AAA2, BBB2

#### Test Results

AAA0 => BBB2, € 5

- [x] OK by postman

Payment IGNORED: Sender not a client of Europay

AAA1 => BBB2, € 7

- [x] OK by postman

Payment IGNORED: Sender has no account in Europay
[TRANSACTION]:[SEND EMAIL] {"destination":"aaa1@test.com","template":"","params":{},"asHTML":true}

AAA2 => BBB2 (€ 125)

Payment REJECTED: Sender has insufficient amount on its account

[PAYMENT] Sender has insufficient account
[TRANSACTION]:[CREATE TRANSACTION]
[TRANSACTION]:[SEND EMAIL] {"destination":"aaa2@test.com","template":"","params":{},"asHTML":true}

- [x] OK by postman

AAA2 => BBB0 (€ 5)

Payment REJECTED: Receiver is no client

[TRANSACTION]:[CREATE TRANSACTION]
[TRANSACTION]:[SEND EMAIL] {"destination":"aaa2@test.com","template":"","params":{},"asHTML":true}

- [x] OK by postman

AAA2 => BBB1 (€ 5)

Payment REJECTED: Receiver has no account

[TRANSACTION]:[CREATE TRANSACTION]
[TRANSACTION]:[SEND EMAIL] {"destination":"aaa2@test.com","template":"","params":{},"asHTML":true,"cc":"bbb1@test.com"}

- [x] OK by postman

AAA2 => BBB2 (€ 7)

Payment COMPLETED: Client transaction done

[TRANSACTION]:[CREATE TRANSACTION]
[TRANSACTION]:[ADJUST SENDER ACCOUNT] -5
[TRANSACTION]:[ADJUST RECEIVER ACCOUNT] 5
[TRANSACTION]:[SEND EMAIL] {"destination":"bbb2@test.com","template":"","params":{},"asHTML":true,"cc":"aaa2@test.com"}

- [x] OK by postman

AAA2 => BANK

Payment COMPLETED: Bank transaction done

[TRANSACTION]:[CREATE TRANSACTION]
[TRANSACTION]:[ADJUST SENDER ACCOUNT] -5
[TRANSACTION]:[SEND EMAIL] {"destination":"aaa2@test.com","template":"","params":{},"asHTML":true}

- [x] OK by postman

#### Templates

Sender unknown to Europay PARTY_UNKNOWN ok
Sender has no account PARTY_WITHOUT_ACCOUNT ok

Receiver unknown to Europay PARTY_UNKNOWN ok
Receiver has no account PARTY_WITHOUT_ACCOUNT ok

Sender has unsufficient povisioning PARTY_INSUFFICIENT_AMOUNT ok

Client Payment EMAIL_WITH_TRANSACTION_MESSAGE/EMAIL_WITH_TRANSACTION_NO_MESSAGE ok
Bank Payment EMAIL_WITH_TRANSACTION_MESSAGE/EMAIL_WITH_TRANSACTION_NO_MESSAGE (notify is bank payment)
