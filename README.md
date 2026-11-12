# The Q4 Rush: Ignite Holiday Edition

Twelve working days in the Ignite office. Drag briefs onto the team, hold the line through emergencies, and bank as much as the quarter will pay. The score is total earnings.

## Play

The modules and the leaderboard need HTTP. PHP stores the Top 10 and keeps emails in a file the browser cannot read:

```bash
php -S 127.0.0.1:8080 router.php
```

Open `http://127.0.0.1:8080`.

`router.php` blocks `/storage`. On Apache, `storage/.htaccess` does the same job. The PHP built-in server does not read `.htaccess`, so use the router when the score file should stay private.

GitHub Pages can host the office, and it cannot run PHP. The game still plays. The results screen says the board needs a PHP host.

A shorter day for rehearsal is `http://127.0.0.1:8080/?daySeconds=20` (8 to 3600 seconds). The shipped day length is `dayLengthSeconds` in `js/config.js` (240 = 4 minutes). The clock reads 6 game hours. Durations in `js/catalog.js` stay in the old 12-hour scale, and the labels are halved, so a job or a training block keeps the same real minutes.

## How the office works

- Drag a brief onto a person. Drop it on their queue to choose the slot. Drag a queued pill to reorder it.
- Titles are cryptic. The skill chips are the brief. Matching a specialty finishes the work faster. The office does not highlight a match.
- Client work expires if it sits in the tray. MOU briefs are ordinary work and do not block anything else.
- Emergencies stop the office. A box names the problem in plain words and who can take it. The day waits until you send it. It takes that person's desk immediately, pushing the job they were already on back into the queue. Each one arrives at a random time before noon (the office runs 8:00–2:00). The day 11 emergency occupies both named people.
- The last three seconds of a day show a large 3, 2, 1 behind the office.
- Holding a brief against the top or bottom edge of the screen scrolls the roster.
- Coffee and morale fall while people are working, faster than a single cheap perk can cover. Each morning brings them back to at least a tired start if they bottomed out. At empty, every job slows. The day 10 espresso emergency stops coffee from returning until it is handled.
- The shop opens after days 1 through 11. Perks and training spend cash. Training also takes hours at the start of the next morning, and that person does not work until it ends. Day 12 goes straight to the score.
- Spending cash does not lower the score. The score is every dollar earned.

## Roster

| Name | Role | Specialties |
| --- | --- | --- |
| Coree-Ann | CEO / PM / Sales | Strategy, Social, MOU |
| Brandon | COO / Paid Ads | AdWords, Display, Sales |
| Tomas | Web Lead / Tech | Web Dev, Design, Tech |
| Sean | Paid Media | FB Ads, Display, AdWords |
| Kajal | Graphic / Social / Web | Design, Social, UI |
| Jessica | Financials / PM | Invoicing, MOU, Ops |

Each person has a three-tier tree in `js/catalog.js`. A tier costs cash at night and hours the next morning. The last tier adds a specialty or cuts an emergency short.

## Leaderboard

The results screen posts `{ "name", "email", "score" }` to `leaderboard.php`. The reply is the top 10 names and scores. Emails are appended to `storage/scores.jsonl` and are not included in the reply. A score outside the top 10 is not stored.

## Avatars

Motion lives in `lottie/`. The illustrated SVG token stays underneath if an animation cannot load. `vendor/lottie.min.js` is [Lottie Web](https://github.com/airbnb/lottie-web) 5.12.2 (MIT, see `vendor/lottie.LICENSE.md`). To use an approved photo instead, set a path in `PORTRAITS` inside `js/ui.js`:

```js
const PORTRAITS = {
  coree: "assets/coree.jpg",
};
```

## Tuning

`js/config.js` holds the day length, tray size, queue size, spawn rate, and how long a brief waits. `js/catalog.js` holds the briefs, the 12-day emergencies, the skill trees, and the office perks.
