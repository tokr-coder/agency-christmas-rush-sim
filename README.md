# The Q4 Rush: Ignite Holiday Edition

A browser management game set on the Ignite floor. Sign the client MOU, staff six real teammates against incoming campaigns, and bank **$100,000** in lifetime ROI before the holiday shutdown clock hits zero.

## Play

Serve the folder over HTTP so the modules load, then open the local URL:

```bash
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080`.

## How the floor works

- **MOU gate.** AdWords, Web Redesign, and Social Blitz start locked. Assign someone to **Client MOU Approval** before the rest of the queue will take staff.
- **Assign Staff.** Pick a task, then pick a ready teammate. Matching their specialty to the brief shortens the job. A stretch assignment still ships, slower.
- **Coffee and morale.** Every active job sips both. At 0%, the whole floor slows hard. Perks restore regen, cut the drain, speed work, or raise ROI.
- **Budget vs. goal.** Installing a perk spends budget. Lifetime ROI does not go backwards. The win is $100,000 earned before the clock ends.
- **Client hold.** Unstaffed work walks if you leave it too long.

## Roster

| Name | Role | Specialties |
| --- | --- | --- |
| Coree-Ann | CEO / PM / Sales | Strategy, Social, MOU |
| Brandon | COO / Paid Ads | AdWords, Display, Sales |
| Tomas | Web Lead / Tech | Web Dev, Design, Tech |
| Sean | Paid Media Specialist | FB Ads, Display, AdWords |
| Kajal | Graphic / Social / Web | Design, Social, UI |
| Jessica | Financials / PM | Invoicing, MOU, Ops |

## Avatars

The six portraits are original illustrated tokens, not likenesses. To swap in an approved photo, set a path in `PORTRAITS` inside `js/ui.js`:

```js
const PORTRAITS = {
  coree: "assets/coree.jpg",
};
```
