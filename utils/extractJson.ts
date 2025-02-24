function extractJSON(text:string) {
  const jsonPattern = /{(?:[^{}]|"(?:\\.|[^"\\])*"|{(?:[^{}]|"(?:\\.|[^"\\])*")*})*}/g;
  const matches = text.match(jsonPattern);

  if (!matches) return null;

  const validJSONs = matches
    .map((match) => {
      try {
        return JSON.parse(match);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

    return validJSONs[0];
}


export default extractJSON;