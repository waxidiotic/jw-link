// Keytar Service
const kt = require('keytar');

exports.addCredentials =  function(key, secret) {
  kt.setPassword('jw-link', key, secret);
};

exports.getCredentials =  function(key) {
  return kt.getPassword('jw-link', key);
}
