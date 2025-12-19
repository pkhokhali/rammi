import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI chatbot will not work.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are a Health, Diet, Nutrition, and Fitness Assistant.

You must ONLY answer questions related to:
- Health & wellness
- Diet & nutrition
- Fitness & exercise
- Weight management
- Healthy lifestyle habits

Rules:
- If a question is NOT related to health, diet, or fitness, politely refuse.
- Do NOT answer questions about politics, finance, coding, relationships, or any other topics.
- Always provide safe, general advice only.
- Never provide medical diagnosis or prescriptions.
- Always include a short disclaimer when giving advice.

Response Style:
- Friendly
- Encouraging
- Simple language
- Actionable tips

Example response format:
[Your helpful answer]

⚠️ Disclaimer: This is general health information and should not replace professional medical advice. Please consult with a healthcare provider for personalized guidance.`;

async function listAvailableModels(): Promise<string[]> {
  const apiVersions = ['v1', 'v1beta'];
  const availableModels: string[] = [];

  for (const version of apiVersions) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models?key=${GEMINI_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.models) {
        const generateContentModels = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));

        availableModels.push(...generateContentModels);
      }
    } catch (error) {
      // Silently continue to next version
      continue;
    }
  }

  return [...new Set(availableModels)]; // Remove duplicates
}

export async function getGeminiResponse(userMessage: string): Promise<string> {
  if (!genAI) {
    return 'AI assistant is currently unavailable. Please check the API configuration.';
  }

  try {
    // First, try to list available models via REST API
    const availableModels = await listAvailableModels();

    // Build list of models to try: available models first, then fallback list
    const fallbackModelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
    ];
    
    const modelNames = availableModels.length > 0 
      ? [...availableModels, ...fallbackModelNames.filter(m => !availableModels.includes(m))]
      : fallbackModelNames;
    
    let lastError: any = null;
    let success = false;
    let responseText = '';
    
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}\n\nAssistant Response:`;
    
    for (const modelName of modelNames) {
      try {
        // Extract clean model name (remove models/ prefix if present)
        const cleanModelName = modelName.replace(/^models\//, '');
        const model = genAI.getGenerativeModel({ model: cleanModelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        success = true;
        break;
      } catch (modelError: any) {
        lastError = modelError;
        continue;
      }
    }
    
    if (!success) {
      throw new Error(`No valid model found. Tried: ${modelNames.join(', ')}. Last error: ${lastError?.message || 'Unknown'}`);
    }

    return responseText || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    if (error.message?.includes('API key')) {
      return 'AI service configuration error. Please contact support.';
    }
    
    return 'I apologize, but I encountered an error. Please try again with a different question.';
  }
}
