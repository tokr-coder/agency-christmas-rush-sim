# Santa's Workshop

Twelve days on the toy conveyor. Drag the belt, send icons down the spurs, and finish each elf's list. The score is total earnings. The night shop spends what you have banked, and spending does not lower the score. The Ignite mark stays in the corner.

## Play

The modules and the leaderboard need HTTP. PHP stores the Top 10 and keeps emails in a file the browser cannot read:

```bash
php -S 127.0.0.1:8080 router.php
```

Open `http://127.0.0.1:8080`.

`router.php` blocks `/storage`. On Apache, `storage/.htaccess` does the same job. The PHP built-in server does not read `.htaccess`, so use the router when the score file should stay private.

GitHub Pages can host the workshop, and it cannot run PHP. The game still plays. The results screen says the board needs a PHP host.

A shorter day for rehearsal is `http://127.0.0.1:8080/?daySeconds=20` (8 to 3600 seconds). The shipped day length is `dayLengthSeconds` in `js/config.js` (75 seconds).

## How a day works

- The slots above the belt are the queue. Empty slots are open. A toy steps onto the green cup when that cup is empty.
- The belt is two rails with round ends. It does not move by itself. Drag along it to slide the cups.
- A curved spur runs to each elf. Tap the toy on that cup to send it. A spur that already has a toy will not take another. Tap a toy at the elf to send it back. A full end sends the toy back the other way.
- Order does not matter. Toys fill the first open cup, and an elf accepts only as many toys as the list shows. When those icons match, those cups clear, pay earnings, and a new list appears. A holding cup, bought at night, can keep one extra toy and is not cleared.
- When the belt is more than half full and a list is one toy short, with a cup open, the next toy is the one that list still needs.
- Later days add toy icons, longer lists, more benches, a faster line, a rush, or a jammed spur.
- After each day except the last, the shop sells a longer queue, faster tracks, one holding cup, one extra bench, and elf training. Training spends earnings and that elf misses the start of the next morning, then their track is quicker for the rest of the run. Cheer is turned off for now.

## Leaderboard

The results screen posts `{ "name", "email", "score" }` to `leaderboard.php`. The score is total earnings. The reply is the top 10 names and scores. Emails are appended to `storage/scores.jsonl` and are not included in the reply. A score outside the top 10 is not stored.

## Avatars

Motion lives in `lottie/`. `vendor/lottie.min.js` is [Lottie Web](https://github.com/airbnb/lottie-web) 5.12.2 (MIT, see `vendor/lottie.LICENSE.md`).

## Tuning

`js/config.js` holds the day length, belt size, line size, and cup count. `js/catalog.js` holds the toy icons, the 12-day ramp, and the shop.
