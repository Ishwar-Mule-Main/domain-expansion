import { prisma } from "../db/prisma";

interface GenerateEmailArgs {
  name: string;
  company?: string | null;
  industry?: string | null;
  website?: string | null;
  prospectId?: string | null;
  prospectEmail?: string | null;
  settings: any;
}

/**
 * Call Google Gemini API
 */
async function fetchGoogleGemini(prompt: string, apiKey: string, useJsonSchema: boolean): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  if (useJsonSchema) {
    requestBody.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          subject: { type: "STRING" },
          body: { type: "STRING" },
        },
        required: ["subject", "body"],
      }
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Failed to retrieve text content from Google Gemini response.");
  }
  return textContent;
}

/**
 * Call OpenRouter API
 */
async function fetchOpenRouter(prompt: string, apiKey: string, model: string, useJsonSchema: boolean): Promise<string> {
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";

  const requestBody: any = {
    model: model || "google/gemini-2.0-flash",
    messages: [
      { role: "user", content: prompt }
    ]
  };

  if (useJsonSchema) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://domainexpansion.in",
      "X-Title": "Domain Expansion Outreach Suite",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.choices?.[0]?.message?.content;
  if (!textContent) {
    throw new Error("Failed to retrieve text content from OpenRouter response.");
  }
  return textContent;
}

/**
 * Generic controller executing request and logging success/fail.
 * Supports auto-failover provider mechanisms.
 */
async function executeTextGeneration({
  prompt,
  settings,
  actionType,
  prospectId,
  prospectEmail,
  useJsonSchema
}: {
  prompt: string;
  settings: any;
  actionType: "PITCH" | "REPLY";
  prospectId?: string | null;
  prospectEmail?: string | null;
  useJsonSchema: boolean;
}): Promise<string> {
  const preferred = settings.preferredProvider || "GOOGLE";
  const fallback = settings.fallbackEnabled !== false;

  let primaryError: any = null;

  // Track provider attempts
  const providersToTry = [preferred];
  if (fallback) {
    const secondary = preferred === "GOOGLE" ? "OPENROUTER" : "GOOGLE";
    providersToTry.push(secondary);
  }

  for (let i = 0; i < providersToTry.length; i++) {
    const provider = providersToTry[i];
    const isGoogle = provider === "GOOGLE";
    const apiKey = isGoogle ? settings.geminiApiKey : settings.openRouterApiKey;
    const model = isGoogle ? "gemini-2.0-flash" : settings.openRouterModel;

    if (!apiKey) {
      const errorMsg = `${provider} API key is missing.`;
      if (i === 0) primaryError = new Error(errorMsg);
      continue;
    }

    try {
      let result = "";
      if (isGoogle) {
        result = await fetchGoogleGemini(prompt, apiKey, useJsonSchema);
      } else {
        result = await fetchOpenRouter(prompt, apiKey, model, useJsonSchema);
      }

      // Log success to Master Brain
      await prisma.masterBrainLog.create({
        data: {
          prospectId,
          prospectEmail,
          provider,
          model,
          actionType,
          prompt,
          response: result,
          status: "SUCCESS"
        }
      });

      return result;
    } catch (err: any) {
      console.error(`${provider} generation failed:`, err);
      
      // Log failure to Master Brain
      await prisma.masterBrainLog.create({
        data: {
          prospectId,
          prospectEmail,
          provider,
          model,
          actionType,
          prompt,
          status: "FAILED",
          errorMessage: err.message || String(err)
        }
      });

      if (i === 0) {
        primaryError = err;
      }
    }
  }

  throw new Error(`AI generation failed. Primary error: ${primaryError?.message || "Unknown error"}`);
}

/**
 * Call the Gemini or OpenRouter API to generate a personalized cold pitch.
 */
export async function generatePitchEmail({
  name,
  company,
  industry,
  website,
  prospectId,
  prospectEmail,
  settings,
}: GenerateEmailArgs): Promise<{ subject: string; body: string }> {
  
  const prompt = `
    ${settings.pitchPrompt}

    Prospect Information:
    - Name: ${name}
    - Company: ${company || "Not provided (refer generally as their business)"}
    - Industry: ${industry || "Not provided (infer from context or keep general)"}
    - Website: ${website || "Not provided"}

    Generate a highly personalized cold email. 
    Return the response as a JSON object containing "subject" and "body". 
    "body" should contain the email body in HTML format (using basic styling tags like <p>, <strong>, <br>, but no <html> or <body> wrapper). 
    Ensure it addresses the prospect by name and aligns the pitch to their company and industry context.
  `;

  const textContent = await executeTextGeneration({
    prompt,
    settings,
    actionType: "PITCH",
    prospectId,
    prospectEmail,
    useJsonSchema: true
  });

  try {
    const parsed = JSON.parse(textContent.trim());
    return {
      subject: parsed.subject || "Growth partnership opportunity with Domain Expansion",
      body: parsed.body || `Hi ${name}, <br><br>I hope this email finds you well. I'm reaching out from Domain Expansion...`,
    };
  } catch (err) {
    console.error("JSON parsing of pitch generation failed. Output text:", textContent);
    // Fallback parsing
    return {
      subject: "Partnership opportunity with Domain Expansion",
      body: textContent
    };
  }
}

/**
 * Call the Gemini or OpenRouter API to generate a reply to a prospect's email.
 */
export async function generateAILogReply(
  prospectName: string,
  replyText: string,
  prospectId: string,
  prospectEmail: string,
  settings: any
): Promise<string> {
  const prompt = `
    ${settings.replyPrompt}

    Context:
    - Prospect Name: ${prospectName}
    - Prospect Reply Message:
    "${replyText}"

    Generate a friendly and professional follow-up response in HTML format (using tags like <p>, <br>, <strong>). Do not include any HTML head or body wrapper tags. Just the email content.
  `;

  return executeTextGeneration({
    prompt,
    settings,
    actionType: "REPLY",
    prospectId,
    prospectEmail,
    useJsonSchema: false
  });
}
