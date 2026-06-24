import katex from "katex";

interface MathTextProps {
  text: string;
  inline?: boolean;
}

type TextPart =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string; displayMode: boolean };

export function MathText({ text, inline = false }: MathTextProps) {
  const parts = splitMathText(text);
  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper className={inline ? "math-text-inline" : "math-text"}>
      {parts.map((part, index) => {
        if (part.kind === "text") {
          return <span key={`${part.kind}-${index}`}>{part.value}</span>;
        }

        const html = katex.renderToString(part.value, {
          displayMode: part.displayMode,
          throwOnError: false,
          strict: "warn",
        });

        return (
          <span
            className={part.displayMode ? "math-block" : "math-inline"}
            dangerouslySetInnerHTML={{ __html: html }}
            key={`${part.kind}-${index}`}
          />
        );
      })}
    </Wrapper>
  );
}

function splitMathText(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const blockStart = text.indexOf("$$", cursor);
    const inlineStart = text.indexOf("$", cursor);
    const nextStart = chooseNextStart(blockStart, inlineStart);

    if (nextStart === -1) {
      parts.push({ kind: "text", value: text.slice(cursor) });
      break;
    }

    if (nextStart > cursor) {
      parts.push({ kind: "text", value: text.slice(cursor, nextStart) });
    }

    const isBlock = text.startsWith("$$", nextStart);
    const delimiter = isBlock ? "$$" : "$";
    const contentStart = nextStart + delimiter.length;
    const contentEnd = text.indexOf(delimiter, contentStart);

    if (contentEnd === -1) {
      parts.push({ kind: "text", value: text.slice(nextStart) });
      break;
    }

    parts.push({
      kind: "math",
      value: text.slice(contentStart, contentEnd),
      displayMode: isBlock,
    });
    cursor = contentEnd + delimiter.length;
  }

  return parts.filter((part) => part.value.length > 0);
}

function chooseNextStart(blockStart: number, inlineStart: number): number {
  if (blockStart === -1) {
    return inlineStart;
  }
  if (inlineStart === -1) {
    return blockStart;
  }
  return Math.min(blockStart, inlineStart);
}
