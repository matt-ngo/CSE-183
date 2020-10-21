/**
 * CSE183 Assignment 3
 */
class Templater {
  /**
   * Create a templater
   * @param {string} template - A {{ }} tagged string
   */
  constructor(template) {
    this.template = template;
  }

  /**
   * Apply map to template to generate string
   * @param {object} map Object with propeties matching tags in template
   * @param {boolean} strict Throw an Error if any tags in template are
   *     not found in map
   * @return {string} template with all tags replaced
   * @throws An Error if strict is set and any tags in template are not
   *     found in map
   */
  apply(map, strict) {
    // alias
    let template = this.template;
    // base cases
    if (template == undefined) {
      return undefined;
    } else if (template === '') {
      return '';
    }

    let templateModified = true;
    while (templateModified) {
      const oldTemplate = template;
      /*
       * /{{([^}]+)}}/g :
       * finds global occurrences of substrings starting with {{,
       * some char (not a }), then ends with a }}
       */
      template = template.replace(/{{([^}]+)}}/g, (tag, key) => {
        // eliminate spaces around key with .trim
        const value = map[key.trim()];

        if (value === undefined) {
          if (strict) {
            throw new Error('Error: tag is undefined');
          }
          // replace with dummy tag
          return '<>';
        } else {
          return value;
        }
      });
      /*
       * delete dummy tag and surrounding space accordingly
       * for both beginning and end tag edge cases
       */
      // some non-space then the tag
      template = template.replace(/<>[^ <\n]/g, (match, key) => {
        return match[match.length - 1];
      });
      // the tag then some non-space
      template = template.replace(/[^ >]<>/g, (match, key) => {
        return match[0];
      });
      // tags with spaces
      template = template.replace(/ <>/g, '');
      template = template.replace(/<> /g, '');
      template = template.replace('<>', '');

      templateModified = template !== oldTemplate;
    }
    return template;
  }
}

module.exports = Templater;
