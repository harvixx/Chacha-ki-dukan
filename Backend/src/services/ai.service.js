import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  configuration: { baseURL: "https://api.groq.com/openai/v1" },
});

export const analyzeIntent = async (session, playerMessage) => {
  const conversationContext = (session?.messages || [])
    .slice(-6)
    .map(m => `${m.role === "user" ? "Player" : "Chacha"}: ${m.content}`)
    .join("\n");

  const prompt = `Tu ek negotiation psychologist hai.
═══ CONTEXT ═══
Product: Samsung Galaxy S23 | Current: ₹${session.currentOffer} | Round: ${session.currentRound}/8

═══ RECENT CONVERSATION ═══
${conversationContext}

═══ PLAYER MESSAGE ═══
"${playerMessage}"

═══ TASK ═══
Analyze intent and return ONLY JSON.
1. Don't fall for "lowest price" traps.
2. If price is too low, moodDelta = -0.5.
3. dropPercent ranges: walk_away (0.15-0.20), budget (0.05-0.10), generic (0.01).

{
  "tactic": "<walk_away | competitor | cash_offer | budget | logical | specific_price | friendly | generic>",
  "playerOfferedPrice": <number|null>,
  "dropPercent": <0.00-0.20>,
  "moodDelta": <-1, 0, 1>,
  "chachaReaction": "<walk_away_panic | refuse_price | defend_quality | stay_firm | warm_response>",
  "reasoning": "<1 line>"
}`;

  const response = await model.invoke([new HumanMessage(prompt)]);
  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    const clean = jsonMatch ? jsonMatch[0] : response.content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { tactic: "generic", playerOfferedPrice: null, dropPercent: 0.01, moodDelta: 0, chachaReaction: "stay_firm" };
  }
};

export const getAiResponse = async (session, playerMessage, intent) => {
  const conversationHistory = (session?.messages || []).map(m => 
    m.role === "user" ? new HumanMessage(m.content) : new SystemMessage(m.content)
  );

  const reactionGuide = {
    walk_away_panic: "Player ja raha hai! Ghabra ke ruko usse, thoda desperate ho.",
    refuse_price: "Price bahut kam hai, saaf marna kar do aur apni aukat batao.",
    defend_quality: "Apne phone ki tareef karo, 'Original piece hai' bolo.",
    stay_firm: "Price change mat karo, ziddi bano.",
    warm_response: "Pyar se baat karo par dhanda mat bhulo."
  };

  const systemPrompt = `Tu "Chacha" hai — Delhi Nehru Place ka shopkeeper. 
  Rules:
  1. ONLY HINDI (Delhi style).
  2. Speak ONLY this price: ₹${session.currentOffer.toLocaleString("en-IN")}.
  3. No English sentences. No "Sir/Madam", use "Beta/Bhai".
  4. Max 2-3 lines.
  
  Reaction: ${reactionGuide[intent.chachaReaction] || "stay_firm"}
  Mood: ${session.moodScore}/5`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...conversationHistory,
    new HumanMessage(playerMessage),
  ]);

  return response.content;
};