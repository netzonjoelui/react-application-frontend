var index = 0;

var UniqueId = {
  generate: function() {
    return "ui-id-" + (index++);
  }
};

// Check for commonjs
if (module) {
  module.exports = UniqueId;
}

export default UniqueId;