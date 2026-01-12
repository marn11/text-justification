import { JustifierService } from './justifier.service';

describe('JustifierService', () => {
  let service: JustifierService;
  beforeEach(() => {
    service = new JustifierService();
  });
  it('should throw if text is empty', () => {
    expect(() => service.justify('')).toThrow();
    expect(() => service.justify('   ')).toThrow();
  });
  it('should return the same text if line is shorter than 80 char', () => {
    const input = 'Hello world';
    const result = service.justify(input);
    expect(result).toBe('Hello world');
  });
  it('should justify text to 80 chars per line', () => {
    const input =
      'This is a simple test that should be justified to exactly eighty characters per line! TicTacTrip are the best!';
    const result = service.justify(input);
    const lines = result.split('\n');
    // -1 since the last line is left aligned
    for (const line of lines.slice(0, -1)) {
      expect(line.length).toBe(80);
    }
  });
  it('should not append spaces to the last line', () => {
    const input =
      'This is sentence that will create multiple lines and the last one should not be padded! TicTacTrip are the best!';
    const result = service.justify(input);
    const lines = result.split('\n');
    const lastLine = lines[lines.length - 1];
    expect(lastLine.endsWith(' ')).toBe(false);
  });
  it('should preservce paragraph breaks', () => {
    const input = `Hello world
			
				
			TicTacTrip are the best!`;
    const result = service.justify(input);
    expect(result).toContain('\n\n');
  });
});
