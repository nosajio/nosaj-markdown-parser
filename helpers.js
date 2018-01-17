const debug = require('debug')('nosaj:helpers:blog');
const fileOpener  = require('./file-opener');
const markdownParser = require('./markdown-parser');

module.exports = { 
  parsePostFile, 
  sortPostsByDate,
  augmentPosts,
  allPosts,
};

function dateToString(rawDate) {
  const date = new Date(rawDate);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  // Only return the year when it isn't the current year
  return date.getFullYear() !== new Date().getFullYear() ?
    `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` : 
    `${date.getDate()} ${months[date.getMonth()]}`;
}

/**
 * Retrieve all Posts, parsed and sorted
 * @returns {Promise<Array>} 
 */
function allPosts() {
  return new Promise(resolve => {
    fileOpener
      .openAll()
      .then((files) => {
        const posts = files
          .map(f => 
            Object.assign(
              {}, 
              markdownParser.parseFilename(f.name), 
              markdownParser.parseFile(f.body)
            ) 
          );
        const sortedPosts = sortPostsByDate(posts);
        const augmentedPosts = augmentPosts(sortedPosts);
        resolve(augmentedPosts);
      });
  });
}

/**
 *  Assign extra properties to post object
 */
function augmentPosts(posts) {
  return posts.map(post => 
    Object.assign(
      {},
      post,
      {
        dateString: dateToString(post.date),
      }
    )
  );
}

/**
 * 
 */
function sortPostsByDate(posts) {
  return posts.sort((a, b) => {
    if (new Date(b.date) === new Date(a.date)) {
      return 0;
    }
    if (new Date(b.date) > new Date(a.date)) {
      return 1;
    }
    return -1;
  });
}

/**
 * Parse a post file
 * @param {Object} file
 */
function parsePostFile(file) {
  const postParsed = markdownParser.parseFile(file.body);
  const fileParsed = markdownParser.parseFilename(file.name);
  return Object.assign({}, postParsed, fileParsed);
}
