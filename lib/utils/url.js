var regex = /(\b(?:https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

module.exports = {
  regex: regex,
  isValid: function(url) {
    return url.match(regex) !== null;
  },
  parse: function(url) {
    return url.match(regex);
  }
}
