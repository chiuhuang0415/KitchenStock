import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStockAnalysis = async (inventory: InventoryItem[]): Promise<string> => {
  try {
    const inventoryText = inventory
      .map(item => `- ${item.category} | ${item.name}: ${item.quantity} ${item.unit}`)
      .join('\n');

    const prompt = `
      我現在是廚房管理員，這是我目前的庫存清單：
      ${inventoryText}

      請幫我分析這份庫存並產生一份「叫貨建議單」。
      規則：
      1. 庫存數量為 0 的項目標記為 [急缺]。
      2. 庫存數量小於 3 的項目標記為 [建議補貨]。
      3. 請依照類別分組顯示。
      4. 最後給一句簡短的整體庫存健康度評語。
      5. 用繁體中文回答，語氣專業且簡潔。
      6. 如果所有庫存都充足（大於等於 3），請稱讚庫存管理良好。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more consistent formatting
      }
    });

    return response.text || "無法產生分析結果，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務目前無法連線，請檢查網路或 API Key。";
  }
};
