import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClothingItem, Category, Season, OutfitSuggestion } from "../types";

// Initialize Gemini Client
// NOTE: process.env.API_KEY is automatically provided in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ------------------------------------------
// 1. Image Analysis (Auto-tagging)
// ------------------------------------------

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "简短的描述性名称 (例如: '蓝色牛仔夹克')" },
    category: { type: Type.STRING, enum: Object.values(Category) },
    season: { type: Type.STRING, enum: Object.values(Season) },
    color: { type: Type.STRING, description: "物品的主要颜色" },
    description: { type: Type.STRING, description: "关于款式和材质的简短中文描述" },
  },
  required: ["name", "category", "season", "color", "description"],
};

export const analyzeImageWithGemini = async (base64Image: string): Promise<Partial<ClothingItem>> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "分析这件衣物。识别类别、适用季节、颜色，并提供简短的中文名称和描述。请严格返回有效的 JSON 格式。",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("图片分析失败，请重试。");
  }
};

// ------------------------------------------
// 2. Outfit Recommendation
// ------------------------------------------

const outfitSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    outfitName: { type: Type.STRING, description: "这套搭配的创意中文名称" },
    items: {
      type: Type.ARRAY,
      items: { type: Type.STRING, description: "衣物物品的 ID" },
      description: "组成这套搭配的库存物品的确切 ID 列表"
    },
    reasoning: { type: Type.STRING, description: "中文解释为什么这套搭配适合该场合/天气" },
  },
  required: ["outfitName", "items", "reasoning"],
};

export const suggestOutfitWithGemini = async (
  inventory: ClothingItem[],
  occasion: string,
  weather: string
): Promise<OutfitSuggestion> => {
  try {
    const inventorySummary = inventory.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      location: item.location
    }));

    const prompt = `
      你是一位专业的时尚造型师。
      用户情境:
      - 场合: ${occasion}
      - 天气: ${weather}

      可用衣橱库存 (JSON):
      ${JSON.stringify(inventorySummary)}

      任务: 从可用库存中选择最佳搭配。
      规则:
      1. 选择上装和下装（或连衣裙），如果有鞋子也请选择。
      2. 确保颜色协调和风格匹配。
      3. 返回所选物品的确切 ID。
      4. 请用中文回答。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: outfitSchema,
        temperature: 0.7,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as OutfitSuggestion;

  } catch (error) {
    console.error("Gemini Stylist Error:", error);
    throw new Error("搭配生成失败，请重试。");
  }
};

// ------------------------------------------
// 3. Outfit Visualization (Virtual Try-On)
// ------------------------------------------

export const generateOutfitVisualization = async (items: ClothingItem[]): Promise<string> => {
  try {
    // We construct the parts array manually to satisfy TypeScript and Gemini API requirements
    const parts: Array<{
      text?: string;
      inlineData?: { mimeType: string; data: string };
    }> = items.map(item => ({
      inlineData: {
        // Use regex to detect or default to jpeg, though typically we strip the header anyway.
        // Assuming jpeg is fine for the API input.
        mimeType: "image/jpeg",
        data: item.imageUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ""),
      }
    }));

    // Add prompt text requesting a virtual try-on visualization
    parts.push({
      text: "Based on these clothing items, generate a high-quality, full-body realistic fashion illustration of a model wearing this complete outfit. The style should be modern and natural. Show clearly how these items look when worn together."
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts },
    });

    // Find image part in the response
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("未生成图片");
  } catch (error) {
    console.error("Gemini Visualization Error:", error);
    throw new Error("无法生成试穿效果图，请稍后重试。");
  }
};