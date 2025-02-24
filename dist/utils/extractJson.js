"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractJSON(text) {
    const jsonPattern = /{(?:[^{}]|"(?:\\.|[^"\\])*"|{(?:[^{}]|"(?:\\.|[^"\\])*")*})*}/g;
    const matches = text.match(jsonPattern);
    if (!matches)
        return null;
    const validJSONs = matches
        .map((match) => {
        try {
            return JSON.parse(match);
        }
        catch (e) {
            return null;
        }
    })
        .filter(Boolean);
    return validJSONs[0];
}
exports.default = extractJSON;
