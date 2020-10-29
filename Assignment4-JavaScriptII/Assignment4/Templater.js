/**
 * CSE 183 Assignment 4
 */
class Templater {
  /**
   * Replace the contents of {{ }} tagged table header and data
   * elements in document with values found in the supplied JSON
   * @param {object} document
   * @param {string} json with propeties matching tags in document
   */
  byTag(document, json) {
    json = JSON.parse(json);

    const table = document.querySelector('#table');
    for (let i = 0, row; row = table.rows[i]; i++) {
      for (let j = 0, col; col = row.cells[j]; j++) {
        col.textContent = col.textContent.replace(/{{([^}]+)}}/g, (t, key) => {
          const value = json[key.trim()];
          if (value === undefined) {
            return '';
          } else {
            console.log(value);
            return value;
          }
        });
      }
    }
  }

  /**
   * Replace the contents of table header and data elements in
   * in document with id'd content found in the supplied JSON
   * @param {object} document
   * @param {string} json with propeties matching element ids in document
   */
  byId(document, json) {
    json = JSON.parse(json);

    const table = document.querySelector('#table');
    for (let i = 0, row; row = table.rows[i]; i++) {
      for (let j = 0, col; col = row.cells[j]; j++) {
        const id = col.id;
        col.textContent = json[id];
      }
    }
  }
}

new Templater;
