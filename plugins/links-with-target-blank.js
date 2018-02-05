
/**
 *  Add target="_blank" to all links that aren't internal
 */
module.exports = function linksWithTargetBlank(md, options) {
  const originalRenderer = md.renderer.rules.link_open;
  md.renderer.rules.link_open = (...args) => {
    const anchor = originalRenderer(...args);
    const isInternal = anchor.includes('nosaj.io');
    if (isInternal) {
      return anchor;
    }
    const anchorWithTarget = anchor.replace('href=', 'target="_blank" href=');
    return anchorWithTarget
  }
}