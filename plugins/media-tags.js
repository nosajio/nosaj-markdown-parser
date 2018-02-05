/**
 *  Media tags are custom markdown selectors that will inflate into blocks of HTML.
 * 
 *  Some useful links for making custom remarkable rules:
 *    https://github.com/jonschlinkert/remarkable/issues/48
 *    https://github.com/jonschlinkert/remarkable/blob/master/docs/parsing_inline.md
 */

module.exports = function mediaTags(md, options) {
  md.inline.ruler.push('image_block', (state, silent) => {
    // matches: %img[the caption](http://a.nosaj.io/img.png)
    const imgTag = /^%img\[([^\]]*)\]\s*\(([^)]+)\)/;
    if (state.src[state.pos] !== '%') return false;

    const match = imgTag.exec(state.src.slice(state.pos));
    if (! match) return false;
    
    if (! silent) {
      state.push({
        type: 'image_block',
        caption: match[1],
        src: match[2],
        level: state.level,
      });
    }

    state.pos += match[0].length;
    
    return true;
  });

  md.renderer.rules.image_block = ([{ type, caption, src }], idx, options, env) => `
    <div class="image">
      <img src="${src}" alt="${caption || ''}" />
      ${caption ? `<div class="caption">${caption}</div>` : ''}
    </div>`;
}