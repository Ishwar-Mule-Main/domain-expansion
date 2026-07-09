interface GenerateEmailArgs {
  name: string;
  company?: string | null;
  industry?: string | null;
  website?: string | null;
  pitchPrompt: string;
  apiKey: string;
}

/**
 * Call the Gemini API to generate a personalized cold pitch.
 */
export async function generatePitchEmail({
  name,
  company,
  industry,
  website,
  pitchPrompt,
  apiKey,
}: GenerateEmailArgs): Promise<{ subject: string; body: string }> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in Settings.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `
    ${pitchPrompt}

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

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          subject: { type: "STRING" },
          body: { type: "STRING" },
        },
        required: ["subject", "body"],
      },
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("Failed to retrieve text content from Gemini API response.");
  }

  const parsed = JSON.parse(textContent.trim());
  return {
    subject: parsed.subject || "Growth partnership opportunity with Domain Expansion",
    body: parsed.body || `Hi ${name}, <br><br>I hope this email finds you well. I'm reaching out from Domain Expansion...`,
  };
}

/**
 * Call the Gemini API to generate a reply to a prospect's email.
 */
export async function generateAILogReply(
  prospectName: string,
  replyText: string,
  replyPrompt: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in Settings.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `
    ${replyPrompt}

    Context:
    - Prospect Name: ${prospectName}
    - Prospect Reply Message:
    "${replyText}"

    Generate a friendly and professional follow-up response in HTML format (using tags like <p>, <br>, <strong>). Do not include any HTML head or body wrapper tags. Just the email content.
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("Failed to retrieve text content from Gemini API response.");
  }

  return textContent;
}
