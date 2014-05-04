
var apiUrl  = 'https://api.github.com/';
var baseUrl = 'http://www.phpcomleite.com.br/';
var github   = new OAuth2('github', {
    client_id: '4ba3a1b159663f42c688',
    client_secret: 'adc57ff77595b8ec11e1c2b3910a0f5ef9f46eaf',
    api_scope:'gist'
});

github.authorize(function() {
    if (github.hasAccessToken()) {
       getGists();
    }
});

/**
 * getGists()
 * Retrieving gists
 */
function getGists()
{
    github.authorize(function(){
        var resource = 'gists';
        var url = apiUrl+resource;
        console.log('sending request ...');
        sendRequest(url, prepareData, github.getAccessToken(),'');
    });
}

/**
 *
 * @param data
 */
function prepareData(data)
{
    console.log('preparing data');
    var data = JSON.parse(data.responseText);
    var html = '';
    data.forEach(function(item, index) {
        var file = getFilesInfos(item.files);
        var language = (file.language==null) ? '': ' <span class="label label-default">'+file.language+'</span>';
        var public = (item.public) ? '': ' <span class="label label-warning">Private</span>';
        var copy = '<span class="badge" title="Copy gist url to clipboard">copy url</span>';
        html += '<a href="'+item.url+'" class="list-group-item">';
        html += '<h5 class="list-group-item-heading"> ';
        html += item.description;
        html += '</h5><p class="list-group-item-text">'+public+language+'</p>'
        html += '</a>';
    });

    document.querySelector('#result').innerHTML = html;
    return;
}

/**
 * getFilesInfos()
 *
 * @param files
 * @returns {{}}
 */
function getFilesInfos(files)
{
    var data = {};
    for(var file in files) {
        var item = files[file]
        data.language=item.language;
    }
    return data;
}

$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

window.addEventListener("DOMContentLoaded", function () {
    logo = document.querySelector(".logo");
    refresh = document.querySelector("#refresh");
    /*logo.addEventListener("click", function(){
        background.msgHandlerOpenTab({url: baseUrl + "/Home.action"})
    });*/
    refresh.addEventListener("click", function(){
        getGists();
    })





});