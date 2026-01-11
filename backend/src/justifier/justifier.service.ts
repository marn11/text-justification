import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class JustifierService {
  private justifyParagraph(words: string[]): string[] {
    const MAX_WIDTH = 80;
    const res: string[] = [];
    let currentLine: string[] = [];
    let length = 0;
    let i = 0;
    while (i < words.length) {
      if (length + currentLine.length + words[i].length > MAX_WIDTH) {
        const extraSpace = MAX_WIDTH - length;
        const gaps = Math.max(1, currentLine.length - 1);
        const spaces = Math.floor(extraSpace / gaps);
        let remainder = extraSpace % gaps;
        for (let j = 0; j < gaps; j++) {
          currentLine[j] += ' '.repeat(spaces);
          if (remainder > 0) {
            currentLine[j] += ' ';
            remainder--;
          }
        }
        res.push(currentLine.join(''));
        currentLine = [];
        length = 0;
        continue;
      }
      currentLine.push(words[i]);
      length += words[i].length;
      i++;
    }
    if (currentLine.length > 0) res.push(currentLine.join(' '));
    return res;
  }
  justify(text: string): string {
    if (!text || !text.trim().length)
      throw new BadRequestException('Missing text to justify');
    const paragraphs = text.split(/\n\s*\n/);
    const res: string[] = [];
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        res.push('');
        continue;
      }
      const words = paragraph.trim().split(/\s+/);
      const lines = this.justifyParagraph(words);
      res.push(lines.join('\n'));
    }
    return res.join('\n\n');
  }
}
