export const STAFF = [
  { id: "coree", name: "Coree-Ann", role: "CEO / PM / Sales", specialties: ["Strategy", "Social", "MOU"], hue: "#6e2430" },
  { id: "brandon", name: "Brandon", role: "COO / Paid Ads", specialties: ["AdWords", "Display", "Sales"], hue: "#1f4a38" },
  { id: "tomas", name: "Tomas", role: "Web Lead / Tech", specialties: ["Web Dev", "Design", "Tech"], hue: "#243246" },
  { id: "sean", name: "Sean", role: "Paid Media", specialties: ["FB Ads", "Display", "AdWords"], hue: "#1d3f6e" },
  { id: "kajal", name: "Kajal", role: "Graphic / Social / Web", specialties: ["Design", "Social", "UI"], hue: "#b26b2c" },
  { id: "jessica", name: "Jessica", role: "Financials / PM", specialties: ["Invoicing", "MOU", "Ops"], hue: "#3f6b52" },
];

/** Cryptic titles. The skill chips are the brief. Durations are in game hours,
 *  about twice the old 16–28 second jobs at the default 4-minute day. */
export const WORK = [
  { skill: "MOU", secondary: "Ops", hours: 1.8, reward: 19, weight: 3, titles: ["Unsigned Page", "Terms Limbo", "Kickoff Papers", "Scope Parcel"] },
  { skill: "MOU", secondary: "Strategy", hours: 2, reward: 22, weight: 2, titles: ["Clause Weather", "Signature Drift", "Onboarding Fog"] },
  { skill: "MOU", secondary: "Invoicing", hours: 1.6, reward: 17, weight: 2, titles: ["Redline Pile", "Initials Missing", "Packet Drift"] },
  { skill: "AdWords", secondary: "Sales", hours: 2.4, reward: 28, weight: 2, titles: ["Query Spend", "Keyword Static", "Bid Weather"] },
  { skill: "Display", secondary: "AdWords", hours: 2.1, reward: 24, weight: 2, titles: ["Banner Fade", "Pixel Quiet", "Placement Hush"] },
  { skill: "FB Ads", secondary: "Display", hours: 2.3, reward: 26, weight: 2, titles: ["Audience Drift", "Placement Noise", "Feed Spend"] },
  { skill: "Social", secondary: "Design", hours: 2, reward: 23, weight: 2, titles: ["Feed Static", "Comment Weather", "Caption Fog"] },
  { skill: "Web Dev", secondary: "Design", hours: 3.2, reward: 36, weight: 2, titles: ["Database Latency", "Checkout Flicker", "Cache Miss"] },
  { skill: "Design", secondary: "UI", hours: 2.6, reward: 27, weight: 2, titles: ["Mark Scale", "Color Argument", "Asset Mismatch"] },
  { skill: "UI", secondary: "Design", hours: 2.2, reward: 25, weight: 2, titles: ["Spacing Debt", "State Mismatch", "Tap Target"] },
  { skill: "Tech", secondary: "Web Dev", hours: 2.5, reward: 26, weight: 1, titles: ["Build Smoke", "Env Drift", "Rack Hum"] },
  { skill: "Strategy", secondary: "Social", hours: 2.8, reward: 32, weight: 1, titles: ["North Star Drift", "Narrative Gap", "Deck Weather"] },
  { skill: "Sales", secondary: "AdWords", hours: 1.9, reward: 21, weight: 1, titles: ["Pipeline Chill", "Leave-Behind", "Room Tone"] },
  { skill: "Invoicing", secondary: "Ops", hours: 1.7, reward: 18, weight: 2, titles: ["Ledger Gap", "Retainer Dust", "Number Frost"] },
  { skill: "Ops", secondary: "Invoicing", hours: 1.7, reward: 17, weight: 1, titles: ["Handoff Tangle", "Folder Weather", "Handover Static"] },
];

export const EVENTS = [
  { day: 2, title: "Scope Weather", detail: "A client wants the holiday campaign redrawn after they already signed off.", allows: ["coree"], hours: 2, tags: ["scope"], lottie: "siren" },
  { day: 3, title: "Rack Dark", detail: "The main server crashed under the Q4 traffic. Sites stay down until it is repaired.", allows: ["tomas"], hours: 6, tags: ["server"], lottie: "server" },
  { day: 4, title: "Name Dropped", detail: "A client's store domain expired. Someone has to buy it back before the shop stays dark.", allows: ["jessica", "tomas"], hours: 4, tags: ["domain"], lottie: "siren" },
  { day: 5, title: "Zero Extra", detail: "An extra zero on the daily ad cap is burning the client's whole Q4 budget.", allows: ["brandon", "sean"], hours: 3, tags: ["adFatigue"], lottie: "siren" },
  { day: 6, title: "Festive Scale", detail: "Nothing gets approved until the logo is much bigger and more festive.", allows: ["kajal"], hours: 3, tags: ["design"], lottie: "siren" },
  { day: 7, title: "Ledger Freeze", detail: "Auditors froze the account. Invoices and MOUs pay nothing until the paperwork is cleared.", allows: ["jessica", "coree"], hours: 4, tags: ["finance", "freeze"], lottie: "siren" },
  { day: 8, title: "Feed Fire", detail: "A scheduled post blew up for the wrong reason. The comments need an answer.", allows: ["sean", "coree"], hours: 4, tags: ["pr"], lottie: "siren" },
  { day: 9, title: "Account Dark", detail: "The ad platform shut the holiday accounts down. Someone has to file the appeal.", allows: ["brandon", "sean"], hours: 5, tags: ["platform", "adFatigue"], lottie: "server" },
  { day: 10, title: "Cup Down", detail: "The espresso machine is dead. Coffee will not come back until it is repaired.", allows: ["jessica"], hours: 3, tags: ["coffeeStop"], lottie: "cup" },
  { day: 11, title: "Overnight Ask", detail: "A client wants a new microsite by morning. Tomas and Kajal both have to take it.", allows: ["tomas", "kajal"], hours: 6, tags: ["rush"], joint: true, lottie: "siren" },
  { day: 12, title: "Flood Gate", detail: "A client site is drowning in traffic in the last hours before the break.", allows: ["tomas", "brandon"], hours: 4, tags: ["server"], lottie: "server" },
];

export const SKILL_TREES = {
  coree: [
    { name: "AI Meeting Notes", cost: 60, downtime: 4, blurb: "MOU work 30% faster" },
    { name: "Executive Account Pitching", cost: 190, downtime: 8, blurb: "Strategy pays +25%" },
    { name: "Crisis Management Lead", cost: 450, downtime: 11, blurb: "Scope and PR events 50% faster. Social speeds up." },
  ],
  brandon: [
    { name: "Automated Email Sorting", cost: 75, downtime: 4, blurb: "AdWords and Display 25% faster" },
    { name: "Chopco Sales Strategy", cost: 210, downtime: 8, blurb: "Sales pays +30%" },
    { name: "Operations Cross-Over", cost: 475, downtime: 11, blurb: "Learns FB Ads. Ad lockouts resolve 50% faster." },
  ],
  tomas: [
    { name: "Server Infrastructure Hardening", cost: 90, downtime: 5, blurb: "Server emergencies resolve much faster" },
    { name: "Modular Architecture", cost: 225, downtime: 8, blurb: "Web Dev 35% faster" },
    { name: "Full-Stack Architect", cost: 525, downtime: 11, blurb: "Learns UI" },
  ],
  sean: [
    { name: "Creative Ad Rotation", cost: 60, downtime: 4, blurb: "FB Ads and Display pay +20%" },
    { name: "Multi-Channel Synchronization", cost: 175, downtime: 7, blurb: "Paid media 20% faster" },
    { name: "Viral Media Lead", cost: 425, downtime: 10, blurb: "Learns Social. No morale drain on ad crises." },
  ],
  kajal: [
    { name: "Rapid Asset Production", cost: 70, downtime: 4, blurb: "Design and UI 30% faster" },
    { name: "Brand Identity Suite", cost: 200, downtime: 8, blurb: "Design and Social pay +25%" },
    { name: "UX/UI Systems Lead", cost: 450, downtime: 11, blurb: "Learns Web Dev" },
  ],
  jessica: [
    { name: "Automated Invoicing Workflows", cost: 75, downtime: 4, blurb: "Invoicing pays +20% and finishes faster" },
    { name: "Resource Allocation Mastery", cost: 190, downtime: 8, blurb: "The floor sips 20% less coffee and morale" },
    { name: "Operations Director", cost: 475, downtime: 10, blurb: "Money and domain crises 50% faster. Learns Strategy." },
  ],
};

export const PERKS = [
  { id: "espresso", name: "Espresso Machine", blurb: "Coffee returns faster", max: 3, costs: [80, 170, 350], effect: "coffeeRegen", values: [3.2, 3.4, 4] },
  { id: "cookies", name: "Cookie Station", blurb: "Morale returns faster", max: 3, costs: [60, 130, 260], effect: "moraleRegen", values: [2.2, 2.2, 2.6] },
  { id: "mute", name: "Holiday Mute", blurb: "Jobs sip less coffee", max: 1, costs: [110], effect: "coffeeDrain", values: [0.22] },
  { id: "pods", name: "Quiet Pods", blurb: "Jobs sip less morale", max: 1, costs: [120], effect: "moraleDrain", values: [0.22] },
  { id: "warroom", name: "War Room", blurb: "Every delivery pays more", max: 2, costs: [200, 400], effect: "reward", values: [0.12, 0.13] },
];
