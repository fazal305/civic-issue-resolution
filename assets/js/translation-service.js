/*
  CivicConnect Civic Language Engine
  Free offline complaint cleanup for English, Roman Urdu, and Urdu
*/

function getNumberWord(value, language) {
    let numbers = {
        English: {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            7: "seven",
        },

        "Roman Urdu": {
            1: "aik",
            2: "do",
            3: "teen",
            4: "char",
            5: "paanch",
            6: "chay",
            7: "saat",
        },

        Urdu: {
            1: "ایک",
            2: "دو",
            3: "تین",
            4: "چار",
            5: "پانچ",
            6: "چھ",
            7: "سات",
        },
    };

    if (numbers[language] && numbers[language][value]) {
        return numbers[language][value];
    }

    return value;
}

function detectDuration(text, language) {
    let lowerText = text.toLowerCase();

    let match = lowerText.match(/(\d+)\s*(din|day|days)/);

    if (match && match[1]) {
        let number = parseInt(match[1]);

        if (language === "English") {
            return "for the past " + getNumberWord(number, language) + " days";
        }

        if (language === "Roman Urdu") {
            return "pichlay " + getNumberWord(number, language) + " dinon se";
        }

        return "گزشتہ " + getNumberWord(number, language) + " دنوں سے";
    }

    if (
        lowerText.indexOf("hafta") !== -1 ||
        lowerText.indexOf("week") !== -1
    ) {
        if (language === "English") {
            return "for the past week";
        }

        if (language === "Roman Urdu") {
            return "pichlay aik haftay se";
        }

        return "گزشتہ ایک ہفتے سے";
    }

    if (language === "English") {
        return "for the past few days";
    }

    if (language === "Roman Urdu") {
        return "pichlay chand dinon se";
    }

    return "گزشتہ چند دنوں سے";
}

function hasAnyWord(text, words) {
    let lowerText = text.toLowerCase();

    let found = false;

    words.forEach(function (word) {
        if (lowerText.indexOf(word) !== -1) {
            found = true;
        }
    });

    return found;
}

function buildEnglishIssue(text, category) {
    let duration = detectDuration(text, "English");

    let details = [];

    if (category === "Gas") {
        if (hasAnyWord(text, ["nahi", "nai", "not coming", "band", "supply"])) {
            details.push("Gas supply has been unavailable " + duration);
        }

        if (hasAnyWord(text, ["pressure", "low pressure", "kam"])) {
            details.push("the gas pressure has remained extremely low");
        }

        if (details.length === 0) {
            details.push("Gas supply in the area has been affected " + duration);
        }

        return details.join(", and ") + ". This has made cooking and daily household activities difficult.";
    }

    if (category === "Water") {
        if (hasAnyWord(text, ["pani", "water", "nahi", "nai", "shortage"])) {
            details.push("Water supply has been disrupted " + duration);
        }

        if (hasAnyWord(text, ["ganda", "dirty", "contaminated", "bad smell"])) {
            details.push("contaminated water is being supplied");
        }

        if (details.length === 0) {
            details.push("Water supply in the area is not functioning properly");
        }

        return details.join(", and ") + ". This is causing serious inconvenience for local residents.";
    }

    if (category === "Electricity") {
        if (hasAnyWord(text, ["bijli", "electricity", "power", "load shedding", "light"])) {
            details.push("Electricity supply has been interrupted " + duration);
        }

        if (hasAnyWord(text, ["voltage", "low voltage", "fluctuation"])) {
            details.push("voltage fluctuation is causing difficulty for residents");
        }

        if (details.length === 0) {
            details.push("Electricity service in the area has been affected");
        }

        return details.join(", and ") + ". This is affecting daily activities, work, and household routines.";
    }

    if (category === "Garbage") {
        if (hasAnyWord(text, ["kachra", "garbage", "waste", "trash"])) {
            details.push("Garbage has accumulated in the area " + duration);
        }

        if (hasAnyWord(text, ["smell", "badboo", "bad smell", "gandagi"])) {
            details.push("bad smell and cleanliness problems are affecting residents");
        }

        if (details.length === 0) {
            details.push("Garbage collection in the area has not been managed properly");
        }

        return details.join(", and ") + ". This may create health and sanitation problems.";
    }

    if (category === "Road Damage") {
        if (hasAnyWord(text, ["road", "sadak", "gadda", "pothole", "broken"])) {
            details.push("The road in the area is damaged and has potholes");
        }

        if (hasAnyWord(text, ["accident", "traffic", "danger"])) {
            details.push("the condition is creating traffic and safety risks");
        }

        if (details.length === 0) {
            details.push("The road condition in the area needs urgent repair");
        }

        return details.join(", and ") + ". This is causing difficulty for pedestrians and vehicles.";
    }

    return text;
}

function buildRomanUrduIssue(text, category) {
    let duration = detectDuration(text, "Roman Urdu");

    let details = [];

    if (category === "Gas") {
        if (hasAnyWord(text, ["nahi", "nai", "not coming", "band", "supply"])) {
            details.push("Gas ki supply " + duration + " band hai");
        }

        if (hasAnyWord(text, ["pressure", "low pressure", "kam"])) {
            details.push("gas ka pressure bhi bohot kam hai");
        }

        if (details.length === 0) {
            details.push("Ilaqay mein gas ki supply mutasir hai");
        }

        return details.join(", aur ") + ". Is wajah se khaana banana aur rozmarra ke gharailu kaam mushkil ho gaye hain.";
    }

    if (category === "Water") {
        if (hasAnyWord(text, ["pani", "water", "nahi", "nai", "shortage"])) {
            details.push("Pani ki farahmi " + duration + " mutasir hai");
        }

        if (hasAnyWord(text, ["ganda", "dirty", "contaminated", "bad smell"])) {
            details.push("ganda pani aa raha hai");
        }

        if (details.length === 0) {
            details.push("Ilaqay mein pani ki farahmi theek tarah nahi ho rahi");
        }

        return details.join(", aur ") + ". Is wajah se rehne walon ko rozmarra zarooriyat mein pareshani ho rahi hai.";
    }

    if (category === "Electricity") {
        if (hasAnyWord(text, ["bijli", "electricity", "power", "load shedding", "light"])) {
            details.push("Bijli ki supply " + duration + " mutasir hai");
        }

        if (hasAnyWord(text, ["voltage", "low voltage", "fluctuation"])) {
            details.push("voltage ki kami aur fluctuation ka masla bhi hai");
        }

        if (details.length === 0) {
            details.push("Ilaqay mein bijli ka masla hai");
        }

        return details.join(", aur ") + ". Is wajah se gharailu kaam, taleem aur rozmarra zindagi mutasir ho rahi hai.";
    }

    if (category === "Garbage") {
        if (hasAnyWord(text, ["kachra", "garbage", "waste", "trash"])) {
            details.push("Ilaqay mein " + duration + " kachra jama hai");
        }

        if (hasAnyWord(text, ["smell", "badboo", "bad smell", "gandagi"])) {
            details.push("badboo aur gandagi ki wajah se log pareshan hain");
        }

        if (details.length === 0) {
            details.push("Ilaqay mein safai ka masla hai");
        }

        return details.join(", aur ") + ". Is se sehat aur safai ke masail paida ho rahe hain.";
    }

    if (category === "Road Damage") {
        if (hasAnyWord(text, ["road", "sadak", "gadda", "pothole", "broken"])) {
            details.push("Ilaqay ki sadak kharab hai aur gadday mojood hain");
        }

        if (hasAnyWord(text, ["accident", "traffic", "danger"])) {
            details.push("is ki wajah se traffic aur hifazat ke masail paida ho rahe hain");
        }

        if (details.length === 0) {
            details.push("Ilaqay ki sadak ki halat kharab hai");
        }

        return details.join(", aur ") + ". Is wajah se paidal chalne walon aur gaariyon ko mushkil ka samna hai.";
    }

    return text;
}

function buildUrduIssue(text, category) {
    let duration = detectDuration(text, "Urdu");

    let details = [];

    if (category === "Gas") {
        if (hasAnyWord(text, ["gas", "nahi", "nai", "not coming", "band", "supply", "گیس"])) {
            details.push("گیس کی فراہمی " + duration + " بند ہے");
        }

        if (hasAnyWord(text, ["pressure", "low pressure", "kam", "پریشر"])) {
            details.push("گیس کا پریشر بھی بہت کم ہے");
        }

        if (details.length === 0) {
            details.push("علاقے میں گیس کی فراہمی متاثر ہے");
        }

        return details.join("، اور ") + "۔ اس وجہ سے کھانا پکانے اور روزمرہ گھریلو کاموں میں شدید مشکلات پیش آ رہی ہیں۔";
    }

    if (category === "Water") {
        if (hasAnyWord(text, ["pani", "water", "nahi", "nai", "shortage", "پانی"])) {
            details.push("پانی کی فراہمی " + duration + " متاثر ہے");
        }

        if (hasAnyWord(text, ["ganda", "dirty", "contaminated", "گندا"])) {
            details.push("گندا پانی فراہم ہو رہا ہے");
        }

        if (details.length === 0) {
            details.push("علاقے میں پانی کی فراہمی درست طریقے سے نہیں ہو رہی");
        }

        return details.join("، اور ") + "۔ اس وجہ سے رہائشیوں کو روزمرہ ضروریات میں پریشانی کا سامنا ہے۔";
    }

    if (category === "Electricity") {
        if (hasAnyWord(text, ["bijli", "electricity", "power", "load shedding", "light", "بجلی"])) {
            details.push("بجلی کی فراہمی " + duration + " متاثر ہے");
        }

        if (hasAnyWord(text, ["voltage", "low voltage", "fluctuation", "وولٹیج"])) {
            details.push("وولٹیج کی کمی اور اتار چڑھاؤ کا مسئلہ بھی موجود ہے");
        }

        if (details.length === 0) {
            details.push("علاقے میں بجلی کا مسئلہ موجود ہے");
        }

        return details.join("، اور ") + "۔ اس وجہ سے گھریلو کام، تعلیم اور روزمرہ زندگی متاثر ہو رہی ہے۔";
    }

    if (category === "Garbage") {
        if (hasAnyWord(text, ["kachra", "garbage", "waste", "trash", "کچرا"])) {
            details.push("علاقے میں " + duration + " کچرا جمع ہے");
        }

        if (hasAnyWord(text, ["smell", "badboo", "bad smell", "gandagi", "بدبو", "گندگی"])) {
            details.push("بدبو اور گندگی کی وجہ سے لوگ پریشان ہیں");
        }

        if (details.length === 0) {
            details.push("علاقے میں صفائی کا مسئلہ موجود ہے");
        }

        return details.join("، اور ") + "۔ اس سے صحت اور صفائی کے مسائل پیدا ہو رہے ہیں۔";
    }

    if (category === "Road Damage") {
        if (hasAnyWord(text, ["road", "sadak", "gadda", "pothole", "broken", "سڑک"])) {
            details.push("علاقے کی سڑک خراب ہے اور گڑھے موجود ہیں");
        }

        if (hasAnyWord(text, ["accident", "traffic", "danger", "حادثہ"])) {
            details.push("اس کی وجہ سے ٹریفک اور حفاظتی مسائل پیدا ہو رہے ہیں");
        }

        if (details.length === 0) {
            details.push("علاقے کی سڑک کی حالت خراب ہے");
        }

        return details.join("، اور ") + "۔ اس وجہ سے پیدل چلنے والوں اور گاڑیوں کو مشکلات کا سامنا ہے۔";
    }

    return text;
}

function cleanComplaintText(text, category, targetLanguage) {
    if (targetLanguage === "English") {
        return buildEnglishIssue(text, category);
    }

    if (targetLanguage === "Roman Urdu") {
        return buildRomanUrduIssue(text, category);
    }

    return buildUrduIssue(text, category);
}