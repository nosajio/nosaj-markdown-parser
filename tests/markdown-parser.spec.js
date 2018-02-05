const test = require('tape');
const mdParser = require('../markdown-parser');

const fileStubs = {
  parsable: {
    name: 'parsable-filename-2018-01-04.md',
    contents: 
`---
title: "Test Post"
---
 
Just some *markdown* to test [things work](http://google.com) properly.

Here's an internal [link](https://nosaj.io) :)

%img[The caption](http://a.nosaj.io/an-img.jpg)
`
  },
  unparsable: {
    name: 'unparsable_filename-01-04.md',
  },
}

test('markdownParser', t => {
  t.test('.filenameValid()', t1 => {
    t1.plan(2);
    t1.ok(mdParser.filenameValid(fileStubs.parsable.name), 'Truthy for valid filenames.');
    t1.ok(mdParser.filenameValid(fileStubs.parsable.name), 'Falsey for invalid filenames.');
  });

  t.test('.parseFilename()', t2 => {
    t2.plan(5);
    const parsable = mdParser.parseFilename(fileStubs.parsable.name);
    t2.ok(('slug' in parsable),                                         'Returns a slug');
    t2.ok(('title' in parsable),                                        'Returns a title');
    t2.ok(('date' in parsable),                                         'Returns a date');
    t2.equal(parsable.title,                                            'parsable filename', 'Parse the title correctly')
    t2.throws(() => mdParser.parseFilename(fileStubs.unparsable.name),  'Throws when passed a invalid filename.')
  });

  t.test('.parseFile()', t3 => {
    t3.plan(6);
    const parsable = mdParser.parseFile(fileStubs.parsable.contents);
    t3.ok(('body' in parsable),                                                  'Returns body HTML');
    t3.ok(('plain' in parsable),                                                 'Returns plain text');
    t3.equal(parsable.title, 'Test Post',                                        'Returns frontmatter title.');
    t3.ok(parsable.body.includes('<a target="_blank" href="http://google.com"'), 'Add\'s target="_blank" to external links.');
    t3.ok(parsable.body.includes('<a href="https://nosaj.io"'),                  'Won\'t add target="_blank" to internal links.');
    t3.ok(parsable.body.includes('<div class="image">'),                         'Parse `%img[caption](url)` tags')
  });
})