import {CommandType, parseCommand} from '../../src/features/commandProcessor/domain/command';

describe('parseCommand smoke', () => {
  it('parses russian read command', () => {
    const cmd = parseCommand('Прочитай текст');
    expect(cmd.type).toBe(CommandType.Read);
  });

  it('parses english stop command with highest priority', () => {
    const cmd = parseCommand('stop and read this');
    expect(cmd.type).toBe(CommandType.Stop);
  });

  it('returns unknown when no keyword matches', () => {
    const cmd = parseCommand('weather tomorrow');
    expect(cmd.type).toBe(CommandType.Unknown);
  });
});
