# Santa's Workshop

Twelve working days with the elves. Drag toys onto the benches, hold the line through workshop emergencies, and finish as many toys as the season will allow. The score is toys finished. Each toy also pays stars, and the shop spends those. The Ignite mark stays in the corner.

## Play

The modules and the leaderboard need HTTP. PHP stores the Top 10 and keeps emails in a file the browser cannot read:

```bash
php -S 127.0.0.1:8080 router.php
```

Open `http://127.0.0.1:8080`.

`router.php` blocks `/storage`. On Apache, `storage/.htaccess` does the same job. The PHP built-in server does not read `.htaccess`, so use the router when the score file should stay private.

GitHub Pages can host the workshop, and it cannot run PHP. The game still plays. The results screen says the board needs a PHP host.

A shorter day for rehearsal is `http://127.0.0.1:8080/?daySeconds=20` (8 to 3600 seconds). The shipped day length is `dayLengthSeconds` in `js/config.js` (240 = 4 minutes). The clock reads 6 game hours. Durations in `js/catalog.js` stay in the old 12-hour scale, and the labels are halved, so a toy or a training block keeps the same real minutes.

## How the workshop works

- Drag a toy onto an elf. Drop it on their queue to choose the slot. Drag a queued pill to reorder it.
- Titles are cryptic. The skill chips say how the toy is made: designing, painting, hammering, carving, wrapping. Matching a specialty finishes the work faster. The workshop does not highlight a match.
- A toy expires if it sits in the tray.
- Emergencies stop the workshop. A box names the problem in plain words and who can take it. The day waits until you send it. It takes that elf's bench immediately, pushing the toy they were already on back into the queue. Each one arrives at a random time before noon (the workshop runs 8:00–2:00). The day 11 emergency occupies both named elves.
- The last three seconds of a day show a large 3, 2, 1 behind the workshop.
- Holding a toy against the top or bottom edge of the screen scrolls the roster.
- Eggnog and cheer fall while elves are working, faster than a single cheap perk can cover. Each morning brings them back to at least a tired start if they bottomed out. Empty eggnog makes every toy take more than twice as long. Empty cheer makes a random elf stop and cry for 45 seconds, about every 30 seconds, until cheer returns. The day 10 eggnog emergency stops eggnog from returning until it is handled.
- An eggnog break, when eggnog is under 50, spends 30 minutes and sets eggnog to 50. A candy break spends 30 minutes, lifts cheer to 80, stops the crying, and toys take 1.5× until close.
- The shop opens after days 1 through 11. Perks and training spend stars. Training also takes hours at the start of the next morning, and that elf does not work until it ends. Day 12 goes straight to the score.
- The score is toys finished across the 12 days. Spending stars does not change it. A finished toy still counts when its stars are frozen.

## Roster

| Name | Role | Specialties |
| --- | --- | --- |
| Coree-Ann | Head Elf | Designing, Wrapping, Painting |
| Brandon | Builder | Hammering, Painting, Carving |
| Tomas | Woodwright | Carving, Designing, Hammering |
| Sean | Painter | Painting, Hammering, Wrapping |
| Kajal | Toymaker | Designing, Wrapping, Carving |
| Jessica | Gift Lead | Wrapping, Designing, Hammering |

Each elf has a three-tier tree in `js/catalog.js`. A tier costs stars at night and hours the next morning. The last tier adds a specialty or cuts an emergency short.

## Leaderboard

The results screen posts `{ "name", "email", "score" }` to `leaderboard.php`. The reply is the top 10 names and scores. Emails are appended to `storage/scores.jsonl` and are not included in the reply. A score outside the top 10 is not stored.

## Avatars

The current portraits stay in place until new elf animations arrive. Motion lives in `lottie/`. The illustrated SVG token stays underneath if an animation cannot load. `vendor/lottie.min.js` is [Lottie Web](https://github.com/airbnb/lottie-web) 5.12.2 (MIT, see `vendor/lottie.LICENSE.md`). To use an approved photo instead, set a path in `PORTRAITS` inside `js/ui.js`:

```js
const PORTRAITS = {
  coree: "assets/coree.jpg",
};
```

## Tuning

`js/config.js` holds the day length, tray size, queue size, spawn rate, and how long a toy waits. `js/catalog.js` holds the toys, the 12-day emergencies, the skill trees, and the workshop perks.
