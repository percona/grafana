/** count lines */
export type Count = (text: string, width: number) => number;

export interface uWrap {
  each: (text: string, width: number, cb: (idx0: number, idx1: number) => void | boolean) => void;
  split: (text: string, width: number, limit?: number) => string[];
  count: Count;
  test: (text: string, width: number) => boolean;
}

/**
 * Mock implementation of varPreLine for Jest tests.
 * Returns a simple line counting function that estimates lines based on text width.
 */
export function varPreLine(ctx: CanvasRenderingContext2D): uWrap {
  // Simple mock implementation: estimate lines by dividing text width by available width
  const count: Count = (text: string, width: number) => {
    if (!text || width <= 0) {
      return 1;
    }
    // Use canvas to measure text width, then estimate line count
    const textWidth = ctx.measureText(text).width;
    return Math.max(1, Math.ceil(textWidth / width));
  };

  return {
    each: (text: string, width: number, cb: (idx0: number, idx1: number) => void | boolean) => {
      const lines = count(text, width);
      for (let i = 0; i < lines; i++) {
        const start = Math.floor((text.length * i) / lines);
        const end = Math.floor((text.length * (i + 1)) / lines);
        if (cb(start, end) === false) {
          break;
        }
      }
    },
    split: (text: string, width: number, limit?: number) => {
      const lines = count(text, width);
      const result: string[] = [];
      const maxLines = limit ? Math.min(lines, limit) : lines;
      for (let i = 0; i < maxLines; i++) {
        const start = Math.floor((text.length * i) / lines);
        const end = Math.floor((text.length * (i + 1)) / lines);
        result.push(text.substring(start, end));
      }
      return result;
    },
    count,
    test: (text: string, width: number) => {
      return count(text, width) > 1;
    },
  };
}
