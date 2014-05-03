
var github = new OAuth2('github', {
    client_id: '4ba3a1b159663f42c688',
    client_secret: 'adc57ff77595b8ec11e1c2b3910a0f5ef9f46eaf',
    api_scope:'gist'
});

github.authorize(function() {
    //document.addEventListener('DOMContentLoaded', function() {
    console.log(github.getAccessToken());
    // Make an XHR that creates the task
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                // Great success: parse response with JSON
                console.log('xGists: Granted access');
                console.log(xhr);
                console.log(xhr.responseText);
                var dataata = JSON.parse(xhr.responseText);
                var html = '';
                dataata.forEach(function(item, index) {
                    html += '<li>' + item.id + '</li>';
                });
                document.querySelector('#result').innerHTML = html;
                return;

            } else {
                console.log('xGists: Revoked access');
                console.log(xhr);
            }
        }
    };

    xhr.open('GET', 'https://api.github.com/gists', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'token ' + github.getAccessToken());

    xhr.send();
});