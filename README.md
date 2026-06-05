# Claim-Based Task Distribution Discord Bot

A Discord bot for managing Reddit engagement tasks through a claim-based workflow.

The bot allows administrators to verify members, assign them to karma ranges, create Reddit engagement tasks, let eligible users claim tasks, submit completed work, and track completions through Google Sheets and MongoDB.

## Features

### User Verification System

- `/getverified` command for members
- Reddit profile submission through Discord modal
- Admin approval workflow
- Automatic Karma Range management
- Duplicate prevention

### Karma Range System

Users are categorized into:

- Range A
- Range B
- Range C

Range hierarchy:

A < B < C

Eligibility:

| Task Range | Eligible Users |
| ---------- | -------------- |
| A          | A, B, C        |
| B          | B, C           |
| C          | C              |

### Claim-Based Task Distribution

Admins create tasks using:

/createtask

Task details include:

- Task ID
- Price
- Reddit Post URL
- Karma Range
- Number of Slots
- Optional Comment Templates
- Subreddit Name

The task appears in the claim channel with a Claim button.

The Reddit post URL remains hidden from public view.

### Task Claiming

When a member clicks **Claim Task** button in the general channel:

The bot checks:

- Karma eligibility
- Duplicate claims
- Slot availability

If successful:

- User receives task details via DM
- Claim is recorded in MongoDB
- Assigned comment is sent

When all slots are filled:

- The task message is automatically deleted

### Task Submission

Users submit completed work using:

/submit

A modal collects:

- Task ID
- Admin Name
- Post URL
- Comment URL

The submission is forwarded to the admin review channel.

### Manual Verification

Admins verify submissions using:

/markcompleted

The bot validates:

- Task exists
- Admin owns the task
- User actually claimed the task
- User has not already been marked completed

If valid:

- Completion is recorded
- Google Sheet is updated
- Duplicate submissions are prevented

### Google Sheets Integration

Each admin automatically gets their own worksheet.

Example:

Croco
Reet

Columns:

| TaskID | Username | Post URL | Comment URL | Date | Time | Price | Status |
| ------ | -------- | -------- | ----------- | ---- | ---- | ----- | ------ |

Status is currently stored as: pending

## Tech Stack

### Backend

- Node.js
- Discord.js
- Express

### Database

- MongoDB Atlas
- Mongoose

### Reporting

- Google Sheets API

### Hosting

- Render
- Cron-job.org (keep-alive)

## Project Structure

commands/
handlers/
models/
services/

index.js
sheets.js
deploy-commands.js

### Commands

/getverified
/verified
/createtask
/submit
/markcompleted

### Services

karmaService.js
claimService.js
submissionService.js

## Database Collections

### KarmaRange

{
rangeCode: "A",
users: [
{
userId,
name,
redditLink,
admin
}
]
}

### ClaimTask

{
(taskId, adminName, price, postLink, range, slots, comments, claimedBy);
}

### CompletedSubmission

{
(taskId, adminId, adminName, userId, userName, postLink, commentLink, price);
}

### Admin Collections

Each admin receives a dedicated collection:

croco
reet

Example:

{
taskId: 101,
price: "0.50$",
postUrl,
range,
slots
}

## Environment Variables

TOKEN=
CLIENT_ID=

MONGO_URI=

GOOGLE_SHEET_ID=

ADMIN_CHANNEL_ID=
CLAIM_CHANNEL_ID=
VERIFICATION_CHANNEL_ID=
TASK_SUBMIT_CHANNEL_ID=
TASK_RECORDS_CHANNEL_ID=

## Deployment

Hosted on Render using:

- Web Service
- MongoDB Atlas
- Google Sheets API
- Cron-job.org keep-alive ping

Deployment pipeline:

GitHub
↓
Render
↓
MongoDB Atlas
↓
Google Sheets

## Security Features

- Admin-only verification
- Admin-only task creation
- Admin-only completion approval
- Duplicate claim prevention
- Duplicate completion prevention
- Range-based eligibility checks
- Hidden task URLs
- MongoDB validation
- Google Sheets logging

## Current Workflow

User
↓
/getverified
↓
Admin
↓
/verified
↓
User assigned to Range
↓
Admin creates task
↓
User claims task
↓
Task sent via DM
↓
User completes task
↓
/submit
↓
Admin reviews
↓
/markcompleted
↓
MongoDB Updated
↓
Google Sheet Updated

## License

Private client project.
All rights reserved.
