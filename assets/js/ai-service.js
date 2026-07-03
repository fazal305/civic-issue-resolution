/*
  CivicConnect AI Service
  Uses Puter AI when available.
  Always falls back safely.
*/

function extractAiText(response) {
    if (!response) {
        return "";
    }

    if (typeof response === "string") {
        return response;
    }

    if (response.message && typeof response.message === "string") {
        return response.message;
    }

    if (response.message && response.message.content) {
        return response.message.content;
    }

    if (response.content && typeof response.content === "string") {
        return response.content;
    }

    if (response.text && typeof response.text === "string") {
        return response.text;
    }

    if (response.result && typeof response.result === "string") {
        return response.result;
    }

    if (response.choices && response.choices.length > 0) {
        if (
            response.choices[0].message &&
            response.choices[0].message.content
        ) {
            return response.choices[0].message.content;
        }

        if (response.choices[0].text) {
            return response.choices[0].text;
        }
    }

    return "";
}

function generateComplaintWithAi(category, complaintText, language) {
    return new Promise(function (resolve, reject) {
        if (typeof puter === "undefined" || !puter.ai) {
            reject();

            return;
        }

        puter.quiet = true;

        let prompt =
            "Rewrite this civic complaint as a formal government complaint letter.\n\n" +
            "Output language: " +
            language +
            "\n" +
            "Complaint category: " +
            category +
            "\n" +
            "User complaint: " +
            complaintText +
            "\n\n" +
            "Important rules:\n" +
            "- Output only the final complaint letter.\n" +
            "- Do not explain anything.\n" +
            "- Do not use markdown.\n" +
            "- Do not mix languages.\n" +
            "- Preserve duration, place names, landmarks, numbers, and issue details.\n" +
            "- Include To, Subject, Greeting, Issue Details, Request, Closing, and Signature.";

        let finished = false;

        setTimeout(function () {
            if (!finished) {
                finished = true;

                reject();
            }
        }, 8000);

        puter.ai
            .chat(prompt)
            .then(function (response) {
                if (finished) {
                    return;
                }

                finished = true;

                let aiText = extractAiText(response);

                if (aiText && aiText !== "[object Object]") {
                    resolve(aiText);

                    return;
                }

                reject();
            })
            .catch(function () {
                if (!finished) {
                    finished = true;

                    reject();
                }
            });
    });
}