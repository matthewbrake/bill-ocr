import { GoogleGenAI, Type } from "@google/genai";
import type { BillData } from "./types";

const billSchema = {
  type: Type.OBJECT,
  properties: {
    accountName: { type: Type.STRING, description: "Account holder's full name, if available." },
    accountNumber: { type: Type.STRING, description: "The account number." },
    serviceAddress: { type: Type.STRING, description: "The full service address, if available." },
    statementDate: { type: Type.STRING, description: "The main date of the bill statement (e.g., 'October 5, 2017')." },
    servicePeriodStart: { type: Type.STRING, description: "The start date of the service period, if available (e.g., 'MM/DD/YYYY')." },
    servicePeriodEnd: { type: Type.STRING, description: "The end date of the service period, if available (e.g., 'MM/DD/YYYY')." },
    totalCurrentCharges: { type: Type.NUMBER, description: "The total amount due for the current period." },
    dueDate: { type: Type.STRING, description: "The payment due date, if available." },
    confidenceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 representing confidence in the extracted data's accuracy based on image quality. 1.0 is highest confidence." },
    usageCharts: {
      type: Type.ARRAY, description: "An array of all usage charts found on the bill.",
      items: {
        type: Type.OBJECT, properties: {
          title: { type: Type.STRING, description: "The title of the chart." },
          unit: { type: Type.STRING, description: "The unit of measurement for the usage (e.g., kWh, m³)." },
          data: {
            type: Type.ARRAY, description: "The monthly data points from the chart.",
            items: {
              type: Type.OBJECT, properties: {
                month: { type: Type.STRING, description: "Abbreviated month name (e.g., Oct, Nov)." },
                usage: {
                    type: Type.ARRAY, description: "Usage values for each year shown in the chart.",
                    items: {
                        type: Type.OBJECT, properties: {
                            year: { type: Type.STRING, description: "The year of the usage value." },
                            value: { type: Type.NUMBER, description: "The numerical usage value for that year." }
                        }, required: ["year", "value"]
                    }
                },
              }, required: ["month", "usage"],
            },
          },
        }, required: ["title", "unit", "data"],
      },
    },
    lineItems: {
        type: Type.ARRAY, description: "All individual line items from the charges/details section.",
        items: {
            type: Type.OBJECT, properties: {
                description: { type: Type.STRING, description: "The description of the charge or credit." },
                amount: { type: Type.NUMBER, description: "The corresponding amount. Use negative numbers for payments or credits." },
            }, required: ["description", "amount"],
        }
    }
  },
  required: ["accountNumber", "totalCurrentCharges", "usageCharts", "lineItems"],
};

const prompt = `You are an expert OCR system specializing in utility bills from ANY provider. Your primary goal is to analyze the provided image, even if it is of low quality, and extract the required information with high accuracy.

**Instructions:**
- Analyze the provided utility bill image and extract the information below.
- Format your response strictly as a JSON object that adheres to the provided schema. Do not include any introductory text, explanations, or markdown formatting.
- **Data in Charts**: Carefully estimate the values from the bar heights relative to the y-axis if exact numbers aren't present.
- **Confidence Score**: Based on the image clarity, provide a confidence score between 0.0 (not confident) and 1.0 (very confident).
- **Final Check**: Ensure every required field in the schema is present. If an optional field is not found, omit it from the final JSON.`;

type BillDataSansId = Omit<BillData, 'id' | 'analyzedAt'>;

const postProcessData = (parsedData: any): BillDataSansId => {
    if (typeof parsedData.totalCurrentCharges === 'string') {
        parsedData.totalCurrentCharges = parseFloat(parsedData.totalCurrentCharges.replace(/[^0-9.-]+/g,""));
    }
    return parsedData;
};


export const analyzeBill = async (imageB64: string, apiKey: string): Promise<BillDataSansId> => {
    if (!apiKey) {
        throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: {
            mimeType: imageB64.substring(imageB64.indexOf(":") + 1, imageB64.indexOf(";")),
            data: imageB64.substring(imageB64.indexOf(",") + 1),
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: billSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        return postProcessData(parsedData);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze the bill with Gemini. The model could not process the image. Please check your API key and try a clearer image.");
    }
};
