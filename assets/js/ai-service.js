/*
--------------------------------------------------------
CivicConnect AI Service
Uses Puter AI (No API Key Required)
--------------------------------------------------------
*/

async function generateComplaintWithAi(category, complaintText, language) {
    let prompt = `
You are an expert government complaint writer.

Your job is to rewrite the user's complaint into a professional government complaint letter.

Rules:

1. Detect the user's input language automatically.
2. Translate the complaint into the SELECTED OUTPUT LANGUAGE.
3. NEVER mix languages.
4. Preserve every important fact:
   - duration
   - location
   - names
   - landmarks
   - numbers
   - issue
5. Improve grammar.
6. Make the complaint formal.
7. Translate the category name.
8. Produce ONLY the complaint letter.

Output language:
${language}

Complaint Category:
${category}

User Complaint:
${complaintText}

Letter format:

To

Subject

Greeting

Issue Details

Request

Closing

Signature
`;

    try {
        let response = await puter.ai.chat(prompt);

        if (typeof response === "string") {
            return response;
        }

        if (response.message) {
            return response.message;
        }

        if (response.content) {
            return response.content;
        }

        if (response.text) {
            return response.text;
        }

        return String(response);
    } catch (error) {
        console.error(error);

        throw error;
    }
}