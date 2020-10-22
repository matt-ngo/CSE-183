const Templater = require('./templater');

test('Undefined', () => {
  const t = new Templater(undefined);
  expect(t.apply({})).toBe(undefined);
});

test('Single Tag', () => {
  const t = new Templater('Hello {{tag}}');
  expect(t.apply({tag: 'World'})).toBe('Hello World');
});

test('Multi Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a little lamb');
});

test('Missing Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary had a lamb');
});

test('Missing Tag Strict', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(() => t.apply({had: 'had', lamb: 'lamb'}, true))
      .toThrowError();
});

// 'Advanced' Scenarios
test('No Spaces Between Tags', () => {
  const t = new Templater('Mary {{had}} a {{little}}{{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a littlelamb');
});

test('Tags Appear More Than Once', () => {
  const t = new Templater('{{little}} Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('little Mary had a little lamb');
});

test('Tags Separated by Non-Spaces', () => {
  const t = new Templater('Mary {{had}} a {{little}}-{{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a little-lamb');
});

test('Multi Missing Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}} {{baby}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary had a lamb');
});

test('Empty String', () => {
  const t = new Templater('');
  expect(t.apply({})).toBe('');
});

test('Non-Space Tag Separators', () => {
  const t = new Templater('Hello my name is {{James}}-Smith_{{Bernard}}');
  expect(t.apply({tag: 'World'})).toBe('Hello my name is -Smith_');
});

test('Missing Tag with Alternative Separator Ending', () => {
  const t = new Templater('Mary {{had}} a {{little}}{{lamb}}-sheep');
  expect(t.apply({had: 'had'})).toBe('Mary had a -sheep');
});
