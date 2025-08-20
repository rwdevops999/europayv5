# OTP Jobs

# initialisation

clear all jobs.

each otp entry where status = ONGOING and expirationdate < currentdata => STATUS = EXPIRED

eacht job where status RUNNING and exporationdate >= currentdate

- calculate difference in ms
- start otp job

# OTP JOB

send data:

- jobname
- otpid
- duration

prerequisistion:

set jobId = null;

step1: look for job with jobname => keep job
step2: if (no job) => create job => keep job
step3: sleep job for duration

by execution:
if (job not exists or job.status !== suspended) {
exeute OTP update.
if (job exists)
delete job
}

# SERVER JOBS

# CLIENT JOBS
