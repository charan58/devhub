export function extractTags(code, language) {
    const tags = new Set();
    const normalizedCode = code.toLowerCase();

    const keywordMap = {
        'javascript': ["function", "const", "let", "var", "if", "else", "for", "while", "switch",
            "case", "break", "return", "try", "catch", "async", "await", "import", "export",
            "fetch", "promise", "map", "filter", "console", "log"],

        'python': ["def", "class", "import", "from", "if", "elif", "else", "for", "while", "try",
            "except", "with", "lambda", "return", "async", "await", "yield", "print"],

        'java': ["public", "private", "protected", "class", "interface", "extends", "implements",
            "try", "catch", "finally", "new", "return", "void", "static", "synchronized",
            "abstract", "enum", "import", "package"],

        'mysql': ["select", "insert", "update", "delete", "from", "where", "join", "inner", "left",
            "right", "on", "group by", "order by", "limit", "having", "as"]
    }

    const keywords = keywordMap[language] || [];

    keywords.forEach(keyword => {

        const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
        if(pattern.test(normalizedCode)){
            tags.add(keyword.toLowerCase());
        }
    });

    return Array.from(tags);
}

// console.log(extractTags("print('Hello world!!')", "python"))