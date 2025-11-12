import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const generatePathWithAI = async (goalType, timeframe, userGoalDescription = "") => {
    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const timeframeUnit = goalType === "shortTerm" ? "months" : "years";
        
        const prompt = `
You are a career learning path expert. Generate a personalized learning roadmap based on the following:

- Goal Type: ${goalType}
- Timeframe: ${timeframe} ${timeframeUnit}
${userGoalDescription ? `- User's Goal: ${userGoalDescription}` : ""}

Generate a JSON response with:
1. A clear, specific path title (e.g., "Frontend Developer Path", "Data Science Mastery")
2. An array of 5-8 checkpoints with:
   - title: specific milestone name
   - description: detailed explanation (2-3 sentences)
   - duration: realistic time estimate (e.g., "2 weeks", "1 month")
3. A feasibility score (0-100) based on:
   - Timeframe adequacy
   - Checkpoint progression logic
   - Industry standards

Return ONLY valid JSON in this exact format:
{
  "pathTitle": "string",
  "checkpoints": [
    {
      "title": "string",
      "description": "string",
      "duration": "string"
    }
  ],
  "feasibilityScore": number,
  "feasibilityReason": "string"
}

Make the path realistic, progressive, and achievable within ${timeframe} ${timeframeUnit}.
`;


        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })

        const text = response.text

        // Clean and parse JSON (handle markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/```\n?/g, "").replace(/```\n?$/g, "");
        }

        const aiResponse = JSON.parse(jsonText);

        return {
            success: true,
            data: aiResponse
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};