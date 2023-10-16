const tokens = [
    {
        expression: /\(/,
        type: "LEFT_PAREN",
    },
    {
        expression: /\)/,
        type: "RIGHT_PAREN",
    },
    {
        expression: /\{/,
        type: "LEFT_BRACE",
    },
    {
        expression: /\}/,
        type: "RIGHT_BRACE",
    },
    {
        expression: /\+/,
        type: "PLUS",
    },
    {
        expression: /\*/,
        type: "STAR",
    },
    {
        expression: /==/,
        type: "EQUAL_EQUAL",
    },
    {
        expression: /=>/,
        type: "ARROW",
    },
    {
        expression: /=/,
        type: "EQUAL",
    },
    {
        expression: /"([^"]*)"/,
        type: "STRING",
    },
    {
        expression: /([0-9]+)/,
        type: "NUMBER",
        parse: (lexeme) => parseFloat(lexeme),
    },
    {
        expression: /(const|let)\s/,
        type: "KEYWORD",
    },
    {
        expression: /([a-zA-Z_][0-9a-zA-Z_]*)/,
        type: "IDENTIFIER",
    },
    {
        expression: /\s+/,
        type: "WHITESPACE",
    },
];

const findToken = function (tokens, chunk) {
    for (const token of tokens) {
        const match = chunk.match(
            new RegExp(`^${token.expression.source}(.*)`)
        );
        if (match) {
            // only keep leftover on non capturing tokens
            if (match.length == 2) {
                return {
                    type: token.type,
                    leftover: match[1],
                };
            } else {
                return {
                    type: token.type,
                    literal: token.parse ? token.parse(match[1]) : match[1],
                    leftover: match[2],
                };
            }
        }
    }

    throw Error(`No token matched ${chunk}`);
};

const tokenize = (chunk) => {
    const matchedTokens = [];
    do {
        const { leftover, ...matchedToken } = findToken(tokens, chunk);
        if (!matchedToken) throw Error(`Unable to match '${chunk}'`);
        if (matchedToken.type != "WHITESPACE") matchedTokens.push(matchedToken);
        chunk = leftover;
    } while (chunk);
    return matchedTokens;
};

const source = "const x = () => {}";
console.log(tokenize(source));

//console.log('+=safsdf'.match(/^\+=(.*)/)?.[1])
//console.log(x);
