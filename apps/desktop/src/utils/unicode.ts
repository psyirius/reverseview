function containsTamilCharacters(text: string): boolean {
    // Regular expression to match Tamil Unicode characters (basic range)
    const tamilRegex = /[\u0B80-\u0BFF]/;

    // Test the input text against the regex
    return tamilRegex.test(text);
}