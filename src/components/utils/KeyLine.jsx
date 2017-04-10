var KeyLine = {

  Desktop: {
    GUTTER: 24,
    GUTTER_LESS: 16,
    INCREMENT: 64,
    MENU_ITEM_HEIGHT: 32
  },

  getIncrementalDim: function(dim) {
    return Math.ceil(dim / this.Desktop.INCREMENT) * this.Desktop.INCREMENT;
  }
}

// Check for commonjs
if (module) {
  module.exports = KeyLine;
}

export default KeyLine;