
var baseUrl = 'https://api.parse.com/1',
    appId = '0bGjHi6wVuMFv6yCKEqG19nwbZuDk7JZ9hkLRmeJ',
    apiKey = 'p4wHJgUNyx0Dzms8S0GgDxH44DIILIQgs8G6wJGD', // make sure to use the REST API Key,
    masterKey = 'jHKB2gSWCgKvV8JVF9Lc3nVokMDFUE3eO4AfG0xA';
 
var _register = function(params, lambda, lambdaerror) {
    var method = 'POST',
        url = baseUrl + '/installations',
        payload = (params) ? JSON.stringify(params) : '';
            
    _helper(url, method, payload, function(data, status) {
        Ti.API.log('completed registration: ' + JSON.stringify(status));
       
        lambda(data, status);
    }, function(xhr, error) {
        Ti.API.log('error registration: ' + JSON.stringify(error));
        lambdaerror(error);
    });
};


var _update = function(params, success, error){
	var method = 'POST',
    url = baseUrl + '/installations'+params.installationId,
    payload = (params) ? JSON.stringify(params) : '';
            
    _helper(url, method, payload, function(data, status) {
        Ti.API.log('completed registration: ' + JSON.stringify(status));
       
        lambda(data, status);
    }, function(xhr, error) {
        Ti.API.log('error registration: ' + JSON.stringify(error));
        lambdaerror(error);
    });
}
 
var _helper = function(url, method, params, lambda, lambdaerror) {
    var xhr = Ti.Network.createHTTPClient();
    
    xhr.setTimeout(15000);
 
    xhr.onerror = function(e) {
        lambdaerror(this, e);
    };
 
    xhr.onload = function() {
        lambda(this.responseText, this.status);
    };
    
    params = params.replace(/\./g, '_');
 
    xhr.open(method, url);
    xhr.setRequestHeader('X-Parse-Application-Id', appId);
    xhr.setRequestHeader('X-Parse-REST-API-Key', apiKey);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(params);
};
 
exports.register = _register;