!(function (exports) {
    const bibleVersionInfo = [
        {
            "name": "English (KJV)",
            "file": "kjv.db",
            "font": "Baloo Chettan",
            "books": ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"],
            "copyright": "Public Domain",
            "ltr": true
        },
        {
            "name": "Malayalam (BSI)",
            "file": "municode.db",
            "font": "Baloo Chettan",
            "books": ["ഉൽപത്തി", "പുറപ്പാട്", "ലേവ്യപുസ്തകം", "സംഖ്യാപുസ്തകം", "ആവർത്തനപുസ്തകം", "യോശുവ", "ന്യായാധിപന്മാർ", "രൂത്ത്", "1 ശമൂവേൽ", "2 ശമൂവേൽ", "1 രാജാക്കന്മാർ", "2 രാജാക്കന്മാർ", "1 ദിനവൃത്താന്തം", "2 ദിനവൃത്താന്തം", "എസ്രാ", "നെഹെമ്യാവ്", "എസ്ഥേർ", "ഇയ്യോബ്", "സങ്കീർത്തനങ്ങൾ", "സദൃശ്യവാക്യങ്ങൾ", "സഭാപ്രസംഗി", "ഉത്തമഗീതം", "യെശയ്യാവ്", "യിരെമ്യാവ്", "വിലാപങ്ങൾ", "യെഹെസ്കേൽ", "ദാനീയേൽ", "ഹോശേയ", "യോവേൽ", "ആമോസ്", "ഓബദ്യാവ്", "യോനാ", "മീഖാ", "നഹൂം", "ഹബക്കൂക്", "സെഫന്യാവ്", "ഹഗ്ഗായി", "സെഖര്യാവ്", "മലാഖി", "മത്തായി", "മർക്കൊസ്", "ലൂക്കോസ്", "യോഹന്നാൻ", "പ്രവൃത്തികൾ", "റോമർ", "1 കൊരിന്ത്യർ", "2 കൊരിന്ത്യർ", "ഗലാത്യർ", "എഫെസ്യർ", "ഫിലിപ്പിയർ", "കൊലൊസ്സ്യർ", "1 തെസ്സലൊനീക്യർ", "2 തെസ്സലൊനീക്യർ", "1 തിമൊഥെയൊസ്", "2 തിമൊഥെയൊസ്", "തീത്തൊസ്", "ഫിലേമോൻ", "എബ്രായർ", "യാക്കോബ്", "1 പത്രൊസ്", "2 പത്രൊസ്", "1 യോഹന്നാൻ", "2 യോഹന്നാൻ", "3 യോഹന്നാൻ", "യൂദാ", "വെളിപ്പാട്"],
            "copyright": "Bible Society of India (BSI)",
            "ltr": true
        },
        {
            "name": "Hindi (BSI)",
            "file": "hindi_unicode.db",
            "font": "Baloo",
            "books": ["उत्पत्ति", "निर्गमन", "लैव्यवस्था", "गिनती", "व्यवस्थाविवरण", "यहोशू", "न्यायियों", "रूत", "1 शमूएल", "2 शमूएल", "1 राजा", "2 राजा", "1 इतिहास", "2 इतिहास", "एज्रा", "नहेमायाह", "एस्तेर", "अय्यूब", "भजन संहिता", "नीतिवचन", "सभोपदेशक", "श्रेष्ठगीत", "यशायाह", "यिर्मयाह", "विलापगीत", "यहेजकेल", "दानिय्येल", "होशे", "योएल", "आमोस", "ओबद्दाह", "योना", "मीका", "नहूम", "हबक्कूक", "सपन्याह", "हाग्गै", "जकर्याह", "मलाकी", "मत्ती", "मरकुस", "लूका", "यूहन्ना", "प्रेरितों के काम", "रोमियो", "1 कुरिन्थियों", "2 कुरिन्थियों", "गलातियों", "इफिसियों", "फिलिप्पियों", "कुलुस्सियों", "1 थिस्सलुनीकियों", "2 थिस्सलुनीकियों", "1 तीमुथियुस", "2 तीमुथियुस", "तीतुस", "फिलेमोन", "इब्रानियों", "याकूब", "1 पतरस", "2 पतरस", "1 यूहन्ना", "2 यूहन्ना", "3 यूहन्ना", "यहूदा", "प्रकाशित वाक्य"],
            "copyright": "Bible Society of India (BSI)",
            "ltr": true
        },
        {
            "name": "Tamil (BSI)",
            "file": "tamil.db",
            "font": "Baloo Thambi",
            "books": ["ஆதியாகமம்", "யாத்திராகமம்", "லேவியராகமம்", "எண்ணாகமம்", "உபாகமம்", "யோசுவா", "நியாயாதிபதிகள்", "ரூத்", "1 சாமுவேல்", "2 சாமுவேல்", "1 இராஜாக்கள்", "2 இராஜாக்கள்", "1 நாளாகமம்", "2 நாளாகமம்", "எஸ்றா", "நெகேமியா", "எஸ்தர்", "யோபு", "சங்கீதம்", "நீதிமொழிகள்", "பிரசங்கி", "உன்னதப்பாட்டு", "ஏசாயா", "எரேமியா", "புலம்பல்", "எசேக்கியேல்", "தானியேல்", "ஓசியா", "யோவேல்", "ஆமோஸ்", "ஒபதியா", "யோனா", "மீகா", "நாகூம்", "ஆபகூக்", "செப்பனியா", "ஆகாய்", "சகரியா", "மல்கியா", "மத்தேயு", "மாற்கு", "லூக்கா", "யோவான்", "அப்போஸ்தலர்", "ரோமர்", "1 கொரிந்தியர்", "2 கொரிந்தியர்", "கலாத்தியர்", "எபேசியர்", "பிலிப்பியர்", "கொலோசெயர்", "1 தெசலோனிக்கேயர்", "2 தெசலோனிக்கேயர்", "1 தீமோத்தேயு", "2 தீமோத்தேயு", "தீத்து", "பிலேமோன்", "எபிரெயர்", "யாக்கோபு", "1 பேதுரு", "2 பேதுரு", "1 யோவான்", "2 யோவான்", "3 யோவான்", "யூதா", "வெளிப்படுத்தின விசேஷம்"],
            "copyright": "Bible Society of India (BSI)",
            "ltr": true
        },
        {
            "name": "Telugu (BSI)",
            "file": "telugu.db",
            "font": "Ramabhadra Telugu",
            "books": ["ఆదికాండము", "నిర్గమకాండము", "లేవీయకాండము", "సంఖ్యాకాండము", "ద్వితీయోపదేశకాండమ", "యెహొషువ", "న్యాయాధిపతులు", "రూతు", "సమూయేలు మొదటి గ్రంథము", "సమూయేలు రెండవ గ్రంథము", "రాజులు మొదటి గ్రంథము", "రాజులు రెండవ గ్రంథము", "దినవృత్తాంతములు మొదటి గ్రంథము", "దినవృత్తాంతములు రెండవ గ్రంథము", "ఎజ్రా", "నెహెమ్యా", "ఎస్తేరు", "యోబు గ్రంథము", "కీర్తనల గ్రంథము", "సామెతలు", "ప్రసంగి", "పరమగీతము", "యెషయా గ్రంథము", "యిర్మీయా", "విలాపవాక్యములు", "యెహెజ్కేలు", "దానియేలు", "హొషేయ", "యోవేలు", "ఆమోసు", "ఓబద్యా", "యోనా", "మీకా", "నహూము", "హబక్కూకు", "జెఫన్యా", "హగ్గయి", "జెకర్యా", "మలాకీ", "మత్తయి సువార్త", "మార్కు సువార్త", "లూకా సువార్త", "యోహాను సువార్త", "అపొస్తలుల కార్యములు", "రోమీయులకు", "1 కొరింథీయులకు", "2 కొరింథీయులకు", "గలతీయులకు", "ఎఫెసీయులకు", "ఫిలిప్పీయులకు", "కొలొస్సయులకు", "1 థెస్సలొనీకయులకు", "2 థెస్సలొనీకయులకు", "1 తిమోతికి", "2 తిమోతికి", "తీతుకు", "ఫిలేమోనుకు", "హెబ్రీయులకు", "యాకోబు", "1 పేతురు", "2 పేతురు", "1 యోహాను", "2 యోహాను", "3 యోహాను", "యూదా", "ప్రకటన గ్రంథము"],
            "copyright": "Bible Society of India (BSI)",
            "ltr": true
        },
        {
            "name": "Spanish LBLA",
            "file": "lbla.db",
            "font": "Baloo Chettan",
            "books": ["Génesis", "Exodo", "Levitivo", "Números", "Deuterenomio", "Josúe", "Jueces", "Rut", "1 Samuel", "2 Samuel", "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios", "Eclesiastés", "Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós", "Abdias", "Jonás", "Miqueas", "Nahum", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías", "Mateo", "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses", "Colosenses", "I Tesalonicenses", "II Tesalonicenses", "I Timoteo", "II Timoteo", "Tito", "Filemón", "Hebreos", "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"],
            "copyright": "Lockman Foundation",
            "ltr": true
        }
    ];

    function setPrimaryBooknames() {
        $RvW.booknames = [];
        const e = parseInt($RvW.vvConfigObj.get_booknamestyle());
        switch (e) {
            case 1:
                $RvW.booknames = $RvW.default_booknames;
                break;
            case 2: {
                $RvW.booknames = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][7]
                    .replace(/["']/g, "")
                    .split(",");
                break;
            }
            case 3: {
                let d = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][7]
                    .replace(/["']/g, "")
                    .split(",");
                if (d[0] === $RvW.default_booknames[0]) {
                    $RvW.booknames = d;
                } else {
                    for (let f = 0; f < 66; f++) {
                        let b = d[f] + " (" + $RvW.default_booknames[f] + ")";
                        $RvW.booknames.push(b);
                    }
                }
                break;
            }
            case 4: {
                const c = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][7]
                    .replace(/["']/g, "")
                    .split(",");
                const a = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version2()][7]
                    .replace(/["']/g, "")
                    .split(",");
                if (c[0] === a[0] || a[0] === "") {
                    $RvW.booknames = c;
                } else {
                    for (let f = 0; f < 66; f++) {
                        const b = `${c[f]} (${a[f]})`;
                        $RvW.booknames.push(b);
                    }
                }
                break;
            }
            default: {
                $RvW.booknames = $RvW.default_booknames;
                break;
            }
        }
    }

    exports.setPrimaryBooknames = setPrimaryBooknames;
}(rvw.provide('$RvW')));