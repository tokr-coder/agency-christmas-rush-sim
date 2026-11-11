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
  { day: 2, title: "Scope Weather", allows: ["coree"], hours: 2, tags: ["scope"], lottie: "siren" },
  { day: 3, title: "Rack Dark", allows: ["tomas"], hours: 6, tags: ["server"], lottie: "server" },
  { day: 4, title: "Name Dropped", allows: ["jessica", "tomas"], hours: 4, tags: ["domain"], lottie: "siren" },
  { day: 5, title: "Zero Extra", allows: ["brandon", "sean"], hours: 3, tags: ["adFatigue"], lottie: "siren" },
  { day: 6, title: "Festive Scale", allows: ["kajal"], hours: 3, tags: ["design"], lottie: "siren" },
  { day: 7, title: "Ledger Freeze", allows: ["jessica", "coree"], hours: 4, tags: ["finance", "freeze"], lottie: "siren" },
  { day: 8, title: "Feed Fire", allows: ["sean", "coree"], hours: 4, tags: ["pr"], lottie: "siren" },
  { day: 9, title: "Account Dark", allows: ["brandon", "sean"], hours: 5, tags: ["platform", "adFatigue"], lottie: "server" },
  { day: 10, title: "Cup Down", allows: ["jessica"], hours: 3, tags: ["coffeeStop"], lottie: "cup" },
  { day: 11, title: "Overnight Ask", allows: ["tomas", "kajal"], hours: 6, tags: ["rush"], joint: true, lottie: "siren" },
  { day: 12, title: "Flood Gate", allows: ["tomas", "brandon"], hours: 4, tags: ["server"], lottie: "server" },
];

export const SKILL_TREES = {
  coree: [
    { name: "AI Meeting Notes", cost: 12, downtime: 2, blurb: "MOU work 30% faster" },
    { name: "Executive Account Pitching", cost: 38, downtime: 4, blurb: "Strategy pays +25%" },
    { name: "Crisis Management Lead", cost: 90, downtime: 6, blurb: "Scope and PR events 50% faster. Social speeds up." },
  ],
  brandon: [
    { name: "Automated Email Sorting", cost: 15, downtime: 2, blurb: "AdWords and Display 25% faster" },
    { name: "Chopco Sales Strategy", cost: 42, downtime: 4, blurb: "Sales pays +30%" },
    { name: "Operations Cross-Over", cost: 95, downtime: 6, blurb: "Learns FB Ads. Ad lockouts resolve 50% faster." },
  ],
  tomas: [
    { name: "Server Infrastructure Hardening", cost: 18, downtime: 2.5, blurb: "Server emergencies resolve much faster" },
    { name: "Modular Architecture", cost: 45, downtime: 4, blurb: "Web Dev 35% faster" },
    { name: "Full-Stack Architect", cost: 105, downtime: 6, blurb: "Learns UI" },
  ],
  sean: [
    { name: "Creative Ad Rotation", cost: 12, downtime: 2, blurb: "FB Ads and Display pay +20%" },
    { name: "Multi-Channel Synchronization", cost: 35, downtime: 3.5, blurb: "Paid media 20% faster" },
    { name: "Viral Media Lead", cost: 85, downtime: 5.5, blurb: "Learns Social. No morale drain on ad crises." },
  ],
  kajal: [
    { name: "Rapid Asset Production", cost: 14, downtime: 2, blurb: "Design and UI 30% faster" },
    { name: "Brand Identity Suite", cost: 40, downtime: 4, blurb: "Design and Social pay +25%" },
    { name: "UX/UI Systems Lead", cost: 90, downtime: 6, blurb: "Learns Web Dev" },
  ],
  jessica: [
    { name: "Automated Invoicing Workflows", cost: 15, downtime: 2, blurb: "Invoicing pays +20% and finishes faster" },
    { name: "Resource Allocation Mastery", cost: 38, downtime: 4, blurb: "The floor sips 20% less coffee and morale" },
    { name: "Operations Director", cost: 95, downtime: 5.5, blurb: "Money and domain crises 50% faster. Learns Strategy." },
  ],
};

export const PERKS = [
  { id: "espresso", name: "Espresso Machine", blurb: "Coffee returns faster", max: 3, costs: [16, 34, 70], effect: "coffeeRegen", values: [3.2, 3.4, 4] },
  { id: "cookies", name: "Cookie Station", blurb: "Morale returns faster", max: 3, costs: [12, 26, 52], effect: "moraleRegen", values: [2.2, 2.2, 2.6] },
  { id: "mute", name: "Holiday Mute", blurb: "Jobs sip less coffee", max: 1, costs: [22], effect: "coffeeDrain", values: [0.22] },
  { id: "pods", name: "Quiet Pods", blurb: "Jobs sip less morale", max: 1, costs: [24], effect: "moraleDrain", values: [0.22] },
  { id: "warroom", name: "War Room", blurb: "Every delivery pays more", max: 2, costs: [40, 80], effect: "reward", values: [0.12, 0.13] },
];
