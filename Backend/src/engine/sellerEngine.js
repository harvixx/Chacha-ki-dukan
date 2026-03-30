// sellerEngine.js — Dynamic product-aware game engine

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const cleanPrice = (price) => Math.round(price / 100) * 100;

/**
 * Creates a new game session.
 * @param {string} userId
 * @param {object} product - Product document from DB
 * @param {object} seller  - Seller document from DB
 */
export const createSession = (userId, product = null, seller = null) => {
  // Use product data if available, else fallback to defaults
  const listPrice = product?.listPrice || 25000;
  const difficulty = seller?.difficulty || 2;

  // Floor price = 70-78% of list price (lower for easy sellers, higher for hard)
  const floorPercent = 0.70 + (difficulty * 0.015);
  const floorPrice = cleanPrice(listPrice * (floorPercent + (Math.random() * 0.03)));

  // Target price = 84-92% of list price
  const targetPercent = 0.84 + (difficulty * 0.015);
  const targetPrice = cleanPrice(listPrice * (targetPercent + (Math.random() * 0.02)));

  // Stubbornness scales with difficulty
  const stubbornness = Math.min(9, difficulty + randomBetween(3, 5));

  return {
    userId,
    sellerId: seller?._id || null,
    productId: product?._id || null,
    productName: product?.name || "Samsung Galaxy S23",
    listPrice,
    floorPrice,
    targetPrice,
    stubbornness,
    currentOffer: listPrice,
    concessionGiven: 0,
    moodScore: 3,
    currentRound: 0,
    maxRounds: 8,
    messages: [],
    status: "active",
  };
};

export const applyPriceDrop = (intent, session) => {
  const remaining = session.currentOffer - session.floorPrice;
  if (remaining <= 0) return 0;

  const strengthMap = {
    walk_away: "strong", competitor: "strong", cash_offer: "strong", specific_price: "strong",
    budget: "medium", emotional: "medium", logical: "medium",
    generic: "weak", friendly: "weak"
  };
  const strength = strengthMap[intent?.tactic] || "weak";

  // Early resistance (Round 1 tak Chacha hilega nahi)
  if (session.currentRound <= 1 && strength !== "strong") return 0;

  // Late Game Resistance (Round 6 ke baad Chacha ziddi ho jata hai)
  const roundPenalty = session.currentRound >= 6 ? 0.4 : 1;

  const moodFactor =
    session.moodScore >= 4 ? 1.2 :
    session.moodScore >= 2 ? 1 : 0.7;

  const stubbornFactor = 1 - ((session?.stubbornness || 5) / 10) * 0.4;

  let drop = remaining * (intent?.dropPercent || 0.01) * moodFactor * stubbornFactor * roundPenalty;

  if (strength === "weak") drop = Math.min(drop, 150);

  // Repeat punishment
  const lastMsgs = (session?.messages || []).slice(-3).map(m => m.content);
  if (lastMsgs.includes(intent?.playerMessage)) drop *= 0.2;

  drop = Math.round(drop / 100) * 100;

  if (session.currentOffer - drop < session.floorPrice) {
    drop = session.currentOffer - session.floorPrice;
  }

  return Math.max(0, drop);
};

export const applyMoodChange = (delta, session) => {
  const mood = session.moodScore + delta;
  return parseFloat(Math.min(5, Math.max(1, mood)).toFixed(1));
};

export const applyPressure = (session, intent) => {
  let moodPenalty = 0;
  let message = null;
  const weak = ["generic", "friendly"];
  const roundsLeft = (session?.maxRounds || 8) - (session?.currentRound || 0);

  const last3 = (session?.messages || [])
    .slice(-3)
    .filter(m => m.role === "user")
    .map(m => m.content);

  const repeatWeak = weak.includes(intent.tactic) && last3.every(msg => msg === intent.playerMessage);

  if (repeatWeak) {
    moodPenalty = -0.6;
    message = "Bhai ek hi baat baar-baar mat bolo, lena hai toh solid baat karo.";
  } else if (roundsLeft <= 2) {
    moodPenalty = -0.3;
    message = "Time khoti mat karo sahab, customer line mein hain.";
  }

  return { moodPenalty, pressureMessage: message };
};

export const checkAutoDeal = (session) => {
  if (session.currentOffer <= session.targetPrice && session.moodScore >= 3 && session.currentRound >= 3) {
    return { triggered: true, message: `Theek hai bhai, le jao ₹${session.currentOffer.toLocaleString('en-IN')} mein. Khush raho! 🤝` };
  }
  return { triggered: false };
};

export const updatePrice = (session, drop) => {
  const newPrice = Math.max(session.floorPrice, session.currentOffer - drop);
  return cleanPrice(newPrice);
};

export const calculateScore = (session) => {
  const dealPrice = session?.finalDealPrice || session?.currentOffer || 0;
  const saved = (session?.listPrice || 0) - dealPrice;
  const listPriceSafe = session?.listPrice || 1; // Prevent div by zero
  const savedPercent = parseFloat(((saved / listPriceSafe) * 100).toFixed(1));
  const baseScore = Math.round((saved / session.listPrice) * 1000);
  const efficiencyBonus = Math.max(0, (session.maxRounds - session.currentRound) * 50);
  const totalScore = baseScore + efficiencyBonus;
  
  return {
    savedAmount: saved,
    savedPercent,
    baseScore,
    efficiencyBonus,
    totalScore,
  };
};

export const checkGameOver = (session) => {
  if (session.currentRound > session.maxRounds) return { over: true, reason: "walkaway" };
  return { over: false, reason: null };
};