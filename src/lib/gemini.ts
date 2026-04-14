import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseSMS(smsText: string): Promise<{ 
  amount: number; 
  currency?: string;
  merchant: string; 
  category: Category; 
  date: string;
  cardEnding?: string;
  bankName?: string;
  balance?: number;
} | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract expense details from this bank SMS. 
      SMS: "${smsText}"
      
      Categorize it into one of these exact Sinhala categories: 'ආහාර', 'ප්‍රවාහන', 'බිල්පත්', 'සාප්පු සවාරි', 'වෙනත්'.
      If it's a restaurant/food delivery/supermarket, choose 'ආහාර' or 'සාප්පු සවාරි'.
      If it's transport/uber/taxi, choose 'ප්‍රවාහන'.
      If it's utility/phone bill, choose 'බිල්පත්'.
      Otherwise, choose 'වෙනත්'.
      
      Return the date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ). If time is not in SMS, use current time. If date is not in SMS, use current date.
      Extract the currency (e.g., LKR, AED, USD).
      Extract the card ending number if available.
      Extract the bank name if available.
      Extract the available balance/limit if available.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "The transaction amount" },
            currency: { type: Type.STRING, description: "Currency code like AED, LKR" },
            merchant: { type: Type.STRING, description: "The name of the merchant or recipient" },
            category: { type: Type.STRING, description: "The category in Sinhala" },
            date: { type: Type.STRING, description: "The date of the transaction in ISO format" },
            cardEnding: { type: Type.STRING, description: "Last 4 digits of the card" },
            bankName: { type: Type.STRING, description: "Name of the bank" },
            balance: { type: Type.NUMBER, description: "Available balance or limit" }
          },
          required: ["amount", "merchant", "category", "date"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    const data = JSON.parse(text);
    return {
      amount: data.amount,
      currency: data.currency,
      merchant: data.merchant,
      category: data.category as Category,
      date: data.date,
      cardEnding: data.cardEnding,
      bankName: data.bankName,
      balance: data.balance
    };
  } catch (error) {
    console.error("Error parsing SMS:", error);
    return null;
  }
}
