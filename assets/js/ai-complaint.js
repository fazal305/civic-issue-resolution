function detectCategoryFromText(complaintText) {
  let text = complaintText.toLowerCase();

  if (
    text.indexOf("garbage") !== -1 ||
    text.indexOf("kachra") !== -1 ||
    text.indexOf("waste") !== -1 ||
    text.indexOf("trash") !== -1 ||
    text.indexOf("smell") !== -1 ||
    text.indexOf("badboo") !== -1
  ) {
    return "Garbage";
  }

  if (
    text.indexOf("electricity") !== -1 ||
    text.indexOf("bijli") !== -1 ||
    text.indexOf("power") !== -1 ||
    text.indexOf("load shedding") !== -1 ||
    text.indexOf("wire") !== -1 ||
    text.indexOf("spark") !== -1 ||
    text.indexOf("voltage") !== -1
  ) {
    return "Electricity";
  }

  if (
    text.indexOf("water") !== -1 ||
    text.indexOf("pani") !== -1 ||
    text.indexOf("leakage") !== -1 ||
    text.indexOf("pipeline") !== -1 ||
    text.indexOf("sewerage") !== -1 ||
    text.indexOf("ganda pani") !== -1
  ) {
    return "Water";
  }

  if (
    text.indexOf("gas") !== -1 ||
    text.indexOf("ssgc") !== -1 ||
    text.indexOf("leak") !== -1 ||
    text.indexOf("pressure") !== -1
  ) {
    return "Gas";
  }

  if (
    text.indexOf("road") !== -1 ||
    text.indexOf("sadak") !== -1 ||
    text.indexOf("pothole") !== -1 ||
    text.indexOf("gadda") !== -1 ||
    text.indexOf("footpath") !== -1 ||
    text.indexOf("traffic") !== -1
  ) {
    return "Road Damage";
  }

  return "";
}

function detectComplaintUrgency(complaintText) {
  let text = complaintText.toLowerCase();

  if (
    text.indexOf("leak") !== -1 ||
    text.indexOf("danger") !== -1 ||
    text.indexOf("emergency") !== -1 ||
    text.indexOf("accident") !== -1 ||
    text.indexOf("smell") !== -1 ||
    text.indexOf("badboo") !== -1 ||
    text.indexOf("spark") !== -1 ||
    text.indexOf("broken wire") !== -1 ||
    text.indexOf("gas leak") !== -1
  ) {
    return "High";
  }

  if (
    text.indexOf("many days") !== -1 ||
    text.indexOf("several days") !== -1 ||
    text.indexOf("again") !== -1 ||
    text.indexOf("repeated") !== -1 ||
    text.indexOf("daily") !== -1 ||
    text.indexOf("3 din") !== -1 ||
    text.indexOf("4 din") !== -1 ||
    text.indexOf("5 din") !== -1 ||
    text.indexOf("hafta") !== -1 ||
    text.indexOf("week") !== -1
  ) {
    return "Medium";
  }

  return "Normal";
}

function getWritingSuggestion(complaintText) {
  if (complaintText.length < 50) {
    return "Add more details such as street name, nearby landmark, duration, and impact.";
  }

  if (
    complaintText.toLowerCase().indexOf("where") === -1 &&
    complaintText.toLowerCase().indexOf("area") === -1 &&
    complaintText.toLowerCase().indexOf("street") === -1 &&
    complaintText.toLowerCase().indexOf("road") === -1 &&
    complaintText.toLowerCase().indexOf("ilaqa") === -1 &&
    complaintText.toLowerCase().indexOf("mohalla") === -1
  ) {
    return "Consider mentioning the exact location or nearby landmark.";
  }

  return "Complaint has enough detail for a formal submission.";
}

function buildAiAnalysis(category, complaintText) {
  let detectedCategory = detectCategoryFromText(complaintText);

  let finalCategory = category;

  let categorySuggestion = "Selected category looks correct.";

  if (detectedCategory !== "" && detectedCategory !== category) {
    finalCategory = detectedCategory;

    categorySuggestion =
      "AI detected this may be a " +
      detectedCategory +
      " issue instead of " +
      category +
      ".";
  }

  return {
    department: getDepartmentGuide(finalCategory).department,
    urgency: detectComplaintUrgency(complaintText),
    confidence: detectedCategory === "" ? "Medium" : "High",
    writingQuality: complaintText.length >= 80 ? "Detailed" : "Needs more detail",
    detectedCategory: detectedCategory || category,
    categorySuggestion: categorySuggestion,
    writingSuggestion: getWritingSuggestion(complaintText)
  };
}

function improveComplaintWithLocalAi(category, complaintText, language) {
  let analysis = buildAiAnalysis(category, complaintText);

  let finalCategory = analysis.detectedCategory || category;

  let translatedCategory = getTranslatedCategory(finalCategory, language);

  let cleanIssueText = cleanComplaintText(
    complaintText,
    finalCategory,
    language
  );

  let improvedComplaint = "";

  if (language === "English") {
    improvedComplaint =
      "To: " +
      analysis.department +
      "\n\n" +
      "Subject: Formal Complaint Regarding " +
      translatedCategory +
      "\n\n" +
      "Respected Sir/Madam,\n\n" +
      "I would like to formally report a civic issue related to " +
      translatedCategory +
      " in my area.\n\n" +
      "Issue Details:\n" +
      cleanIssueText +
      "\n\n" +
      "This issue is causing inconvenience for local residents and may become more serious if it is not addressed in time. The estimated urgency level of this complaint is: " +
      analysis.urgency +
      ".\n\n" +
      "I respectfully request the concerned department to inspect the matter and take appropriate action as soon as possible.\n\n" +
      "Thank you.\n\n" +
      "Yours faithfully,\nCitizen";
  } else if (language === "Roman Urdu") {
    improvedComplaint =
      "To: " +
      analysis.department +
      "\n\n" +
      "Subject: " +
      translatedCategory +
      " ki Shikayat\n\n" +
      "Mohtaram Sir/Madam,\n\n" +
      "Main apne ilaqay mein " +
      translatedCategory +
      " se mutalliq masla formally report karna chahta hoon.\n\n" +
      "Maslay ki Tafseel:\n" +
      cleanIssueText +
      "\n\n" +
      "Yeh masla ilaqay ke rehne walon ke liye pareshani ka sabab ban raha hai. Is complaint ki urgency level: " +
      analysis.urgency +
      " hai.\n\n" +
      "Barah-e-karam is maslay ka jaiza liya jaye aur jald az jald munasib karwai ki jaye.\n\n" +
      "Shukriya.\n\n" +
      "Darkhwast Guzar";
  } else {
    improvedComplaint =
      "برائے: " +
      analysis.department +
      "\n\n" +
      "موضوع: " +
      translatedCategory +
      " سے متعلق باضابطہ شکایت\n\n" +
      "محترم جناب/محترمہ،\n\n" +
      "میں اپنے علاقے میں " +
      translatedCategory +
      " سے متعلق مسئلہ باضابطہ طور پر رپورٹ کرنا چاہتا ہوں۔\n\n" +
      "مسئلے کی تفصیل:\n" +
      cleanIssueText +
      "\n\n" +
      "یہ مسئلہ مقامی رہائشیوں کے لیے پریشانی کا باعث بن رہا ہے۔ اس شکایت کی فوری نوعیت: " +
      analysis.urgency +
      " ہے۔\n\n" +
      "براہِ کرم اس مسئلے کا جائزہ لے کر جلد از جلد مناسب کارروائی کی جائے۔\n\n" +
      "شکریہ۔\n\n" +
      "درخواست گزار";
  }

  return {
    complaint: improvedComplaint,
    analysis: analysis
  };
}