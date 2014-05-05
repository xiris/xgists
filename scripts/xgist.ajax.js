
/**
 * XMLHttpFactories()
 *
 * @type {array}
 */
var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

/**
 * createXMLHTTPObject
 *
 * @returns {boolean}
 */
function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

/**
 * sendRequest()
 *
 * @param url       string
 * @param callback  string
 * @param token     string
 * @param data      JSON
 */
function sendRequest(url, callback, token, data) {
    // object instance
    var xhr = createXMLHTTPObject();
    if (!xhr) return;
    var method = (data) ? "POST" : "GET";

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type','application/json');

    if(token)
        xhr.setRequestHeader('Authorization', 'token ' + token);

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200 || xhr.status == 201) return;

        callback(xhr);
    }

    xhr.send(data);
}


