function getDepartmentGuide(category) {
    let guides = {
        Garbage: {
            department: "Karachi Metropolitan Corporation (KMC)",
            helpline: "1339",
            website: "https://1339.gos.pk/",
            note: "Use the official 1339 complaint system for municipal complaints.",
        },

        Electricity: {
            department: "K-Electric",
            helpline: "118 / 99000",
            website: "https://ke.com.pk/contact-us/",
            note: "Use K-Electric customer support for electricity complaints.",
        },

        Water: {
            department: "Karachi Water & Sewerage Corporation (KW&SC)",
            helpline: "99245138 / 99245140",
            website: "https://www.kwsc.gos.pk/",
            note: "Use KW&SC channels for water and sewerage complaints.",
        },

        Gas: {
            department: "Sui Southern Gas Company (SSGC)",
            helpline: "1199 / 99021000",
            website: "https://www.ssgc.com.pk/",
            note: "Use SSGC support for gas leakage, low pressure, and supply issues.",
        },

        "Road Damage": {
            department: "KMC / Works and Services Department",
            helpline: "1339",
            website: "https://1339.gos.pk/",
            note: "For road damage in Karachi, start with the 1339 municipal complaint system.",
        },
    };

    return guides[category] || {
        department: "Concerned Civic Department",
        helpline: "N/A",
        website: "#",
        note: "Submit your complaint through the relevant official department.",
    };
}