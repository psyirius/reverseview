function detectTextLocaleDetailed(text) {
    /**
     * Detects the text locale(s) by determining the percentage of characters
     * falling within Unicode ranges associated with specific locales.
     * Ignores whitespace, newlines, carriage returns, tabs, and punctuation.
     * Handles overlapping character sets between languages. Counts shared characters towards *all* matching locales.
     * Does not include an "others" entry. The percentages may add up to more than 100% due to overlapping characters.
     *
     * @param text The input text to analyze.
     * @returns An array of objects, each containing the locale name and its percentage.
     */

    var localeRanges = {
        english: { regex: /[a-zA-Z]+/g, name: "English" },
        hindi: { regex: /[\u0900-\u097F]+/g, name: "Hindi" },
        bengali: { regex: /[\u0980-\u09FF]+/g, name: "Bengali" },
        gujarati: { regex: /[\u0A80-\u0AFF]+/g, name: "Gujarati" },
        oriya: { regex: /[\u0B00-\u0B7F]+/g, name: "Oriya" },
        punjabi: { regex: /[\u0A00-\u0A7F]+/g, name: "Punjabi" },
        tamil: { regex: /[\u0B80-\u0BFF]+/g, name: "Tamil" },
        malayalam: { regex: /[\u0D00-\u0D7F]+/g, name: "Malayalam" },
        telugu: { regex: /[\u0C00-\u0C7F]+/g, name: "Telugu" },
        kannada: { regex: /[\u0C80-\u0CFF]+/g, name: "Kannada" },
        russian: { regex: /[\u0400-\u04FF]+/g, name: "Russian" },
        arabic: { regex: /[\u0600-\u06FF]+/g, name: "Arabic" },
        chinese: { regex: /[\u4E00-\u9FFF]+/g, name: "Chinese" },
        japanese: { regex: /[\u3040-\u30FF\u31F0-\u31FF]+/g, name: "Japanese" },  //Hiragana and Katakana
    };

    // Remove whitespace, newlines, carriage returns, tabs, and punctuation
    var cleanText = text.replace(/[\s\r\n\t.,?!:;\-\"'()\[\]{}]/g, "");
    var textLength = cleanText.length;

    var localePercentages = {};

    for (var locale in localeRanges) {
        if (localeRanges.hasOwnProperty(locale)) {
            var regex = localeRanges[locale].regex;
            var match;
            var matchLength = 0;

            // Reset regex lastIndex
            regex.lastIndex = 0;

            while ((match = regex.exec(cleanText)) !== null) {
                matchLength += match[0].length; // Count all matches for each locale.
            }
            localePercentages[locale] = matchLength; // Store the raw matchLength
        }
    }

    var results = [];

    for (var locale in localePercentages) {
        if (localePercentages.hasOwnProperty(locale)) {
            var percentage = (localePercentages[locale] / textLength) * 100; // Calculate percentage of total characters, not total *matched* characters
            results.push({ locale: locale, percentage: percentage });
        }
    }

    return results;
}

function printLocaleResults(text, results) {
    /**
     * Prints the locale detection results in a nicely formatted way.
     * @param text The input text.
     * @param results The locale detection results from detectTextLocaleDetailed.
     */

    console.log("Locale analysis for text: \"" + text + "\"");

    if (results.length === 0) {
        console.log("  No matching locales found.");
        return;
    }

    // Sort results by percentage in descending order
    results.sort(function(a, b) { return b.percentage - a.percentage; });

    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        console.log("  " + result.locale + ": " + result.percentage.toFixed(2) + "%"); // Fixed to 2 decimal places
    }

    var totalPercentage = 0;
    for (var i = 0; i < results.length; i++){
        totalPercentage+= results[i].percentage
    }
    console.log("Total Percentages: " + totalPercentage.toFixed(2));
    console.log("---");
}

// Example Usage (add more test cases as needed):
var text1 = "வணக்கம் உலகமே!"; // Tamil
var text2 = "Hello world!"; // English
var text3 = "Hola Mundo"; // Spanish
var text4 = "नमस्कार दुनिया"; // Hindi
var text5 = "ഒരു നല്ല ദിവസമാണ്"; // Malayalam
var text6 = "ಇದು ಕನ್ನಡ ಪಠ್ಯ"; // Kannada
var text7 = "ఈ టెక్స్ట్ తెలుగులో ఉంది"; // Telugu
var text8 = "এটি বাংলা পাঠ্য"; // Bengali
var mixedText = "வணக்கம் World! Hola mundo! নমস্কার 123 .";
var overlapText = "नमस्ते Hello"; // Hindi and English overlap
var punctuationText = "Hello, world! This is a test."; // Punctuation Test
var whitespaceText = "Hello\nworld!\tThis  is a test.";   // Whitespace Test
var unmatchedText = "Unmatched 123 !!!"; //Unmatched characters.
var emptyText = "   , . \n\t"; // Only whitespace and punctuation
var spanishTest = "El perro come. Hello";
var frenchText = "Bonjour le monde!"; // French
var germanText = "Hallo Welt!"; // German
var russianText = "Привет мир!"; //Russian
var arabicText = "مرحبا بالعالم!"; // Arabic
var chineseText = "你好世界"; // Chinese
var japaneseText = "こんにちは世界"; //Japanese
var gujaratiText = "કેમ છો વિશ્વ!"; // Gujarati
var oriyaText = "ଓଡ଼ିଆରେ କିଛି ଲେଖନ୍ତୁ"; // Oriya
var punjabiText = "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨਿਆ!"; // Punjabi

printLocaleResults(text1, detectTextLocaleDetailed(text1));
printLocaleResults(text2, detectTextLocaleDetailed(text2));
printLocaleResults(text3, detectTextLocaleDetailed(text3));
printLocaleResults(text4, detectTextLocaleDetailed(text4));
printLocaleResults(text5, detectTextLocaleDetailed(text5));
printLocaleResults(text6, detectTextLocaleDetailed(text6));
printLocaleResults(text7, detectTextLocaleDetailed(text7));
printLocaleResults(text8, detectTextLocaleDetailed(text8));
printLocaleResults(mixedText, detectTextLocaleDetailed(mixedText));
printLocaleResults(overlapText, detectTextLocaleDetailed(overlapText));
printLocaleResults(punctuationText, detectTextLocaleDetailed(punctuationText));
printLocaleResults(whitespaceText, detectTextLocaleDetailed(whitespaceText));
printLocaleResults(unmatchedText, detectTextLocaleDetailed(unmatchedText));
printLocaleResults(emptyText, detectTextLocaleDetailed(emptyText));
printLocaleResults(spanishTest, detectTextLocaleDetailed(spanishTest));
printLocaleResults(frenchText, detectTextLocaleDetailed(frenchText));
printLocaleResults(germanText, detectTextLocaleDetailed(germanText));
printLocaleResults(russianText, detectTextLocaleDetailed(russianText));
printLocaleResults(arabicText, detectTextLocaleDetailed(arabicText));
printLocaleResults(chineseText, detectTextLocaleDetailed(chineseText));
printLocaleResults(japaneseText, detectTextLocaleDetailed(japaneseText));
printLocaleResults(gujaratiText, detectTextLocaleDetailed(gujaratiText));
printLocaleResults(oriyaText, detectTextLocaleDetailed(oriyaText));
printLocaleResults(punjabiText, detectTextLocaleDetailed(punjabiText));