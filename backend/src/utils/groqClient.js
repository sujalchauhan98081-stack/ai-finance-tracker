let groqInstance = null;

// Dynamically import and initialize Groq when first needed
// This ensures dotenv.config() has already run before we read process.env
export const getGroqClient = async () => {
  if (groqInstance) {
    return groqInstance;
  }

  try {
    const { default: Groq } = await import("groq-sdk");

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    groqInstance = new Groq({ apiKey });
    console.log("✅ Groq client initialized successfully");
    return groqInstance;
  } catch (error) {
    console.error("❌ Failed to initialize Groq:", error.message);
    throw error;
  }
};