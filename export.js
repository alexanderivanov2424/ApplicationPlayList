document.addEventListener('DOMContentLoaded', function() {

  function get(key, callback){
    chrome.storage.local.get([key], callback);
  }

  function save() {
    get('data', function(value) {
      console.log(value)
      if(value == null){
        value = []
      }
      value.push(1)
      chrome.storage.local.set({'data': value}, function() {
        console.log('Value is set to ' + value);
      });
    })
  }

  function load() {
    chrome.storage.local.get(['data'], function(result) {
      console.log('Value currently is ' + result.key);
    });
  }

  document.getElementById('save').addEventListener('click', save);
  document.getElementById('load').addEventListener('click', load);

});
