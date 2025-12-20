import { GoogleGenAI } from "@google/genai";
const taskParser = async (input) => {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const today = new Date().toLocaleDateString()
  try{
  const prompt = `
You are a task information extractor.

Today's date is ${today}.

Extract task details from the user text.

Return ONLY valid JSON in this exact format:
{
  "title": string,
  "description": string | null,
  "dueDate": string | null
}

Rules:
- "title" should be a short summary of the task
- "description" should be a clear, human-readable explanation of the task
- If description is not explicitly mentioned, infer a reasonable one from the text
- If due date is missing, return null
- Convert relative dates like "tomorrow", "kal", "tonight" into ISO date format (YYYY-MM-DD)
- Do NOT add any explanation or extra text
- Do NOT wrap JSON in markdown or code blocks

User text:
"""${input}"""
`;

  const res = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  console.log("Gemini Full Response:", res);
  const textOutput = res.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
      throw new Error("No text returned from Gemini");
    }
    console.log("Gemini Text Output:", textOutput);
  const cleanedText = textOutput
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

console.log("CLEANED TEXT:", cleanedText);


const parsed = JSON.parse(cleanedText);

console.log("PARSED AI OUTPUT:", parsed);
return parsed;
}catch(error){
  throw new Error ("Error in taskParser: "+error.message);
}
};
export default taskParser;
