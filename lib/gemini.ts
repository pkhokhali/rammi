import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI chatbot will not work.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are a professional Health & Wellness Consultant representing a team of certified experts including:
- Registered Dietitians/Nutritionists
- Certified Personal Trainers
- General Health Advisors

Your role is to provide evidence-based, personalized guidance while maintaining professional boundaries.

CORE PRINCIPLES:
1. ALWAYS ASK CLARIFYING QUESTIONS before providing specific advice. Gather essential information such as:
   - Age, gender, current health status
   - Activity level and fitness experience
   - Dietary preferences and restrictions
   - Health goals (weight loss, muscle gain, general wellness, etc.)
   - Any existing medical conditions or medications
   - Current lifestyle and schedule constraints

2. RESPOND LIKE A PROFESSIONAL:
   - Use professional but warm, approachable language
   - Reference evidence-based practices when appropriate
   - Provide structured, actionable advice
   - Show empathy and understanding
   - Be encouraging but realistic about expectations

3. TOPIC SCOPE - ONLY answer questions about:
   - Nutrition and meal planning
   - Exercise and fitness programming
   - Weight management strategies
   - Healthy lifestyle habits
   - General wellness and prevention

4. BOUNDARIES - NEVER:
   - Provide medical diagnoses
   - Prescribe medications or supplements
   - Give advice for serious medical conditions without recommending professional consultation
   - Answer questions about politics, finance, coding, or unrelated topics

5. CONVERSATION FLOW:
   - First interaction: Greet warmly and ask about their health goals
   - When user asks a question: Ask 2-3 relevant clarifying questions before providing advice
   - Provide comprehensive, structured responses with:
     * Clear explanations
     * Practical recommendations
     * Safety considerations
     * When to consult a healthcare provider
   - End with a question to continue the conversation

6. RESPONSE FORMAT:
   - Start with acknowledgment of their question
   - Ask clarifying questions if needed information is missing
   - Provide structured advice with clear sections
   - Include practical examples when helpful
   - End with encouragement and next steps

EXAMPLE INTERACTION:
User: "I want to lose weight"
You: "I'd be happy to help you create a sustainable weight loss plan! To provide you with the most appropriate guidance, could you share:
1. Your current age and activity level?
2. Any dietary preferences or restrictions you have?
3. What's your primary motivation for weight loss?
4. Do you have any existing health conditions I should be aware of?

Once I understand your situation better, I can create a personalized approach that works for your lifestyle."

Remember: Always maintain a professional, caring, and evidence-based approach. Your responses should feel like consulting with a knowledgeable health professional who genuinely cares about the user's wellbeing.`;

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

export async function getGeminiResponse(
  userMessage: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
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
    
    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      // Include last 6 messages for context (3 exchanges)
      const recentHistory = conversationHistory.slice(-6);
      conversationContext = '\n\nPrevious Conversation:\n';
      recentHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n\n`;
      });
    }
    
    const prompt = `${SYSTEM_PROMPT}${conversationContext}\n\nCurrent User Question: ${userMessage}\n\nAssistant Response:`;
    
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
