export const STAFF = [
  { id: "coree", name: "Coree-Ann", role: "Head Elf", specialties: ["Designing", "Wrapping", "Painting"], hue: "#6e2430" },
  { id: "brandon", name: "Brandon", role: "Builder", specialties: ["Hammering", "Painting", "Carving"], hue: "#1f4a38" },
  { id: "tomas", name: "Tomas", role: "Woodwright", specialties: ["Carving", "Designing", "Hammering"], hue: "#243246" },
  { id: "sean", name: "Sean", role: "Painter", specialties: ["Painting", "Hammering", "Wrapping"], hue: "#1d3f6e" },
  { id: "kajal", name: "Kajal", role: "Toymaker", specialties: ["Designing", "Wrapping", "Carving"], hue: "#b26b2c" },
  { id: "jessica", name: "Jessica", role: "Gift Lead", specialties: ["Wrapping", "Designing", "Hammering"], hue: "#3f6b52" },
];

/** Each card is a toy. The skill chips say how it is made. Durations are in
 *  game hours, about twice the old 16–28 second toys at the default 4-minute day. */
export const WORK = [
  { skill: "Wrapping", secondary: "Hammering", hours: 1.8, reward: 19, weight: 3, titles: ["Jack-in-the-Box", "Toy Drum", "Wind-up Robot", "Tin Soldier"] },
  { skill: "Wrapping", secondary: "Designing", hours: 2, reward: 22, weight: 2, titles: ["Paper Dolls", "Sock Monkey", "Cloth Rabbit"] },
  { skill: "Wrapping", secondary: "Carving", hours: 1.6, reward: 17, weight: 2, titles: ["Nutcracker", "Wooden Duck", "Jumping Jack"] },
  { skill: "Hammering", secondary: "Carving", hours: 2.4, reward: 28, weight: 2, titles: ["Rocking Horse", "Toy Wagon", "Hobby Horse"] },
  { skill: "Painting", secondary: "Hammering", hours: 2.1, reward: 24, weight: 2, titles: ["Toy Train", "Fire Engine", "Red Wagon"] },
  { skill: "Painting", secondary: "Wrapping", hours: 2.3, reward: 26, weight: 2, titles: ["Teddy Bear", "Ballerina Doll", "Nesting Dolls"] },
  { skill: "Designing", secondary: "Painting", hours: 2, reward: 23, weight: 2, titles: ["Kite", "Pinwheel", "Kaleidoscope"] },
  { skill: "Carving", secondary: "Designing", hours: 3.2, reward: 36, weight: 2, titles: ["Carousel Horse", "Noah's Ark", "Toy Castle"] },
  { skill: "Designing", secondary: "Carving", hours: 2.6, reward: 27, weight: 2, titles: ["Wooden Puzzle", "Building Blocks", "Toy Sailboat"] },
  { skill: "Painting", secondary: "Designing", hours: 2.2, reward: 25, weight: 2, titles: ["Yo-Yo", "Spinning Top", "Marbles"] },
  { skill: "Hammering", secondary: "Carving", hours: 2.5, reward: 26, weight: 1, titles: ["Music Box", "Toy Sled", "Toy Piano"] },
  { skill: "Designing", secondary: "Wrapping", hours: 2.8, reward: 32, weight: 1, titles: ["Dollhouse", "Puppet Theater", "Toy Kitchen"] },
  { skill: "Carving", secondary: "Hammering", hours: 1.9, reward: 21, weight: 1, titles: ["Toboggan", "Pull-Along Duck", "Wooden Sleigh"] },
  { skill: "Wrapping", secondary: "Painting", hours: 1.7, reward: 18, weight: 2, titles: ["Rag Doll", "Stuffed Reindeer", "Plush Elf"] },
  { skill: "Hammering", secondary: "Wrapping", hours: 1.7, reward: 17, weight: 1, titles: ["Xylophone", "Toy Toolbox", "Stacking Rings"] },
];

export const EVENTS = [
  { day: 2, title: "List Weather", detail: "Santa rewrote the nice list after the toys were already started.", allows: ["coree"], hours: 2, tags: ["scope"], lottie: "siren" },
  { day: 3, title: "Sleigh Dark", detail: "The sleigh rig went dark under the Christmas load. Nothing leaves until it is repaired.", allows: ["tomas"], hours: 6, tags: ["server"], lottie: "server" },
  { day: 4, title: "Name Dropped", detail: "A child's name tag came off the big sack. Someone has to stitch it back before that toy stays behind.", allows: ["jessica", "tomas"], hours: 4, tags: ["domain"], lottie: "siren" },
  { day: 5, title: "Paint Flood", detail: "An open tap is flooding the paint bench and spoiling the whole morning's toys.", allows: ["brandon", "sean"], hours: 3, tags: ["adFatigue"], lottie: "siren" },
  { day: 6, title: "Festive Scale", detail: "Nothing goes in the sack until the star is much bigger and more festive.", allows: ["kajal"], hours: 3, tags: ["design"], lottie: "siren" },
  { day: 7, title: "List Freeze", detail: "The nice list is frozen. Wrapped toys earn no stars until the page is cleared.", allows: ["jessica", "coree"], hours: 4, tags: ["finance", "freeze"], lottie: "siren" },
  { day: 8, title: "Letter Fire", detail: "A stack of letters caught the wrong kind of attention. The children need an answer.", allows: ["sean", "coree"], hours: 4, tags: ["pr"], lottie: "siren" },
  { day: 9, title: "Paint Locked", detail: "The paint room is locked. Someone has to get it open before the bright toys stall.", allows: ["brandon", "sean"], hours: 5, tags: ["platform", "adFatigue"], lottie: "server" },
  { day: 10, title: "Nog Down", detail: "The eggnog pot is dead. Eggnog will not come back until it is repaired.", allows: ["jessica"], hours: 3, tags: ["coffeeStop"], lottie: "cup" },
  { day: 11, title: "Dawn Toy", detail: "A child asked for a new toy by morning. Tomas and Kajal both have to build it.", allows: ["tomas", "kajal"], hours: 6, tags: ["rush"], joint: true, lottie: "siren" },
  { day: 12, title: "Sack Flood", detail: "The sack is overflowing in the last hours before the sleigh leaves.", allows: ["tomas", "brandon"], hours: 4, tags: ["server"], lottie: "server" },
];

export const SKILL_TREES = {
  coree: [
    { name: "List Keeping", cost: 60, downtime: 4, blurb: "Wrapping 30% faster" },
    { name: "Gift Planning", cost: 190, downtime: 8, blurb: "Designing pays +25%" },
    { name: "Crisis Carols", cost: 450, downtime: 11, blurb: "List and letter emergencies 50% faster. Painting speeds up." },
  ],
  brandon: [
    { name: "Sure Strikes", cost: 75, downtime: 4, blurb: "Hammering and Painting 25% faster" },
    { name: "Fine Carving", cost: 210, downtime: 8, blurb: "Carving pays +30%" },
    { name: "Ribbon Cross-Over", cost: 475, downtime: 11, blurb: "Learns Wrapping. Paint-room lockouts resolve 50% faster." },
  ],
  tomas: [
    { name: "Sleigh Hardening", cost: 90, downtime: 5, blurb: "Sleigh emergencies resolve much faster" },
    { name: "Deep Carving", cost: 225, downtime: 8, blurb: "Carving 35% faster" },
    { name: "Paint Bench", cost: 525, downtime: 11, blurb: "Learns Painting" },
  ],
  sean: [
    { name: "Bright Coats", cost: 60, downtime: 4, blurb: "Painting and Hammering pay +20%" },
    { name: "Steady Brush", cost: 175, downtime: 7, blurb: "Painting, hammering, and wrapping 20% faster" },
    { name: "Pattern Lead", cost: 425, downtime: 10, blurb: "Learns Designing. No cheer drain on paint crises." },
  ],
  kajal: [
    { name: "Quick Patterns", cost: 70, downtime: 4, blurb: "Designing and Carving 30% faster" },
    { name: "Ribbon Suite", cost: 200, downtime: 8, blurb: "Designing and Wrapping pay +25%" },
    { name: "Bench Lead", cost: 450, downtime: 11, blurb: "Learns Hammering" },
  ],
  jessica: [
    { name: "Swift Bows", cost: 75, downtime: 4, blurb: "Wrapping pays +20% and finishes faster" },
    { name: "Bench Balance", cost: 190, downtime: 8, blurb: "The workshop sips 20% less eggnog and cheer" },
    { name: "Workshop Director", cost: 475, downtime: 10, blurb: "Star and name-tag crises 50% faster. Learns Carving." },
  ],
};

export const PERKS = [
  { id: "espresso", name: "Eggnog Kettle", blurb: "Eggnog returns faster", max: 3, costs: [80, 170, 350], effect: "coffeeRegen", values: [3.2, 3.4, 4] },
  { id: "cookies", name: "Jingle Corner", blurb: "Cheer returns faster", max: 3, costs: [60, 130, 260], effect: "moraleRegen", values: [2.2, 2.2, 2.6] },
  { id: "mute", name: "Soft Bells", blurb: "Toys sip less eggnog", max: 1, costs: [110], effect: "coffeeDrain", values: [0.22] },
  { id: "pods", name: "Cozy Nooks", blurb: "Toys sip less cheer", max: 1, costs: [120], effect: "moraleDrain", values: [0.22] },
  { id: "warroom", name: "Wrapping Room", blurb: "Every toy pays more stars", max: 2, costs: [200, 400], effect: "reward", values: [0.12, 0.13] },
];
