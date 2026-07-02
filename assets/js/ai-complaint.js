function getDepartmentByCategory(category) {
  if (category === "Garbage") {
    return "Karachi Metropolitan Corporation (KMC)";
  }

  if (category === "Electricity") {
    return "K-Electric";
  }

  if (category === "Water") {
    return "Karachi Water and Sewerage Corporation (KWSC)";
  }

  if (category === "Gas") {
    return "Sui Southern Gas Company (SSGC)";
  }

  if (category === "Road Damage") {
    return "Works and Services Department";
  }

  return "Concerned Civic Department";
}

function detectComplaintUrgency(complaintText) {
  let text = complaintText.toLowerCase();

  if (
    text.indexOf("leak") !== -1 ||
    text.indexOf("danger") !== -1 ||
    text.indexOf("emergency") !== -1 ||
    text.indexOf("accident") !== -1 ||
    text.indexOf("smell") !== -1 ||
    text.indexOf("spark") !== -1 ||
    text.indexOf("broken wire") !== -1
  ) {
    return "High";
  }

  if (
    text.indexOf("many days") !== -1 ||
    text.indexOf("several days") !== -1 ||
    text.indexOf("again") !== -1 ||
    text.indexOf("repeated") !== -1 ||
    text.indexOf("daily") !== -1
  ) {
    return "Medium";
  }

  return "Normal";
}
function detectCategoryFromText(complaintText) {
  let text = complaintText.toLowerCase();

  if (
    text.indexOf("garbage") !== -1 ||
    text.indexOf("kachra") !== -1 ||
    text.indexOf("waste") !== -1 ||
    text.indexOf("trash") !== -1 ||
    text.indexOf("smell") !== -1
  ) {
    return "Garbage";
  }

  if (
    text.indexOf("electricity") !== -1 ||
    text.indexOf("bijli") !== -1 ||
    text.indexOf("power") !== -1 ||
    text.indexOf("load shedding") !== -1 ||
    text.indexOf("wire") !== -1 ||
    text.indexOf("spark") !== -1
  ) {
    return "Electricity";
  }

  if (
    text.indexOf("water") !== -1 ||
    text.indexOf("paani") !== -1 ||
    text.indexOf("leakage") !== -1 ||
    text.indexOf("pipeline") !== -1 ||
    text.indexOf("sewerage") !== -1
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
    text.indexOf("footpath") !== -1 ||
    text.indexOf("traffic") !== -1
  ) {
    return "Road Damage";
  }

  return "";
}
function getWritingSuggestion(complaintText) {
  if (complaintText.length < 50) {
    return "Add more details such as street name, nearby landmark, duration, and impact.";
  }

  if (
    complaintText.toLowerCase().indexOf("where") === -1 &&
    complaintText.toLowerCase().indexOf("area") === -1 &&
    complaintText.toLowerCase().indexOf("street") === -1 &&
    complaintText.toLowerCase().indexOf("road") === -1
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
    department: getDepartmentByCategory(finalCategory),
    urgency: detectComplaintUrgency(complaintText),
    confidence: detectedCategory === "" ? "Medium" : "High",
    writingQuality:
      complaintText.length >= 80 ? "Detailed" : "Needs more detail",
    detectedCategory: detectedCategory || category,
    categorySuggestion: categorySuggestion,
    writingSuggestion: getWritingSuggestion(complaintText),
  };
}

function improveComplaintWithLocalAi(category, complaintText, language) {
  let analysis = buildAiAnalysis(category, complaintText);

  let improvedComplaint = "";

  if (language === "English") {
    improvedComplaint =
      "To: " +
      analysis.department +
      "\n\n" +
      "Subject: Formal Complaint Regarding " +
      category +
      " Issue\n\n" +
      "Respected Sir/Madam,\n\n" +
      "I would like to formally report a civic issue related to " +
      category +
      " in my area.\n\n" +
      "Issue Details:\n" +
      complaintText +
      "\n\n" +
      "This issue is causing inconvenience for local residents and may become more serious if it is not addressed in time. The estimated urgency level of this complaint is: " +
      analysis.urgency +
      ".\n\n" +
      "I respectfully request the concerned department to inspect the matter and take appropriate action as soon as possible.\n\n" +
      "Thank you.";
  } else if (language === "Roman Urdu") {
    improvedComplaint =
      "To: " +
      analysis.department +
      "\n\n" +
      "Subject: " +
      category +
      " maslay ke hawalay se formal complaint\n\n" +
      "Mohtaram Sir/Madam,\n\n" +
      "Main apne ilaqay mein " +
      category +
      " se mutalliq masla formally report karna chahta hoon.\n\n" +
      "Maslay ki tafseel:\n" +
      complaintText +
      "\n\n" +
      "Yeh masla ilaqay ke rehne walon ke liye pareshani ka sabab ban raha hai. Is complaint ki urgency level: " +
      analysis.urgency +
      " hai.\n\n" +
      "Barah-e-karam is maslay ka jaiza liya jaye aur jald az jald munasib karwai ki jaye.\n\n" +
      "Shukriya.";
  } else {
    improvedComplaint =
      "To: " +
      analysis.department +
      "\n\n" +
      "موضوع: " +
      category +
      " سے متعلق باضابطہ شکایت\n\n" +
      "محترم جناب/محترمہ،\n\n" +
      "میں اپنے علاقے میں " +
      category +
      " سے متعلق مسئلہ باضابطہ طور پر رپورٹ کرنا چاہتا ہوں۔\n\n" +
      "مسئلے کی تفصیل:\n" +
      complaintText +
      "\n\n" +
      "یہ مسئلہ مقامی رہائشیوں کے لیے پریشانی کا باعث بن رہا ہے۔ اس شکایت کی فوری نوعیت: " +
      analysis.urgency +
      " ہے۔\n\n" +
      "براہِ کرم اس مسئلے کا جائزہ لے کر جلد از جلد مناسب کارروائی کی جائے۔\n\n" +
      "شکریہ۔";
  }

  return {
    complaint: improvedComplaint,
    analysis: analysis,
  };
}
