import { GoogleGenAI } from "@google/genai";
const taskParser=async(input)=>{
    const client=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})
     const prompt = `
You are a task information extractor.

Today's date is ${today}.

Extract task details from the user text.

Return ONLY valid JSON in this exact format:
{
  "title": string,
  "dueDate": string | null,
  "priority": "low" | "medium" | "high" | null,
  "estimatedMinutes": number | null
}

Rules:
- If information is missing, return null
- Convert relative dates like "tomorrow", "kal", "tonight" into ISO date format
- Do NOT guess values
- Do NOT add any explanation or extra text

User text:
"""${input}"""
`;
    const res=await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents:[
            {
                role:"user",
                parts: [{ text: prompt }],
            }
          ],
    })
     const textOutput =
    res.candidates?.[0]?.content?.parts?.[0]?.text;
if (!textOutput) {
    throw new Error("No text returned from Gemini");
  }
  console.log("Gemini Response:", JSON.parse(textOutput));
   return JSON.parse(textOutput);

   
}
export default taskParser;