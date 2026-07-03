let groqInstance = null;

// Dynamically import and initialize Groq when first needed
export const getGroqClient = async () => {
  if (groqInstance) {
    return groqInstance;
  }

  try {
    console.log("📦 Dynamically importing Groq SDK...");
    const { default: Groq } = await import("groq-sdk");

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    console.log("🔑 Creating Groq instance with API key:", apiKey.substring(0, 15) + "...");
    groqInstance = new Groq({ apiKey });
    
    console.log("✅ Groq client initialized successfully");
    return groqInstance;
  } catch (error) {
    console.error("❌ Failed to initialize Groq:", error.message);
    throw error;
  }
};