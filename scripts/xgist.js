var submitPrivate, submitPublic, formGist, refresh, gistDescription, gistFilename, gistContent;
var apiUrl  = 'https://api.github.com/';
var baseUrl = 'http://www.phpcomleite.com.br/';
var github   = new OAuth2('github', {
    client_id: '4ba3a1b159663f42c688',
    client_secret: 'adc57ff77595b8ec11e1c2b3910a0f5ef9f46eaf',
    api_scope:'gist'
});
/**
 * authorizing on page load
 */
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
        $('#collapseTwo .loading').attr('style', 'display:block');
        $('#collapseTwo #result').attr('style', 'display:none');
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
        html += '<a href="'+item.html_url+'" class="list-group-item" target="_blank">';
        html += '<h5 class="list-group-item-heading"> ';
        html += item.description;
        html += '</h5><p class="list-group-item-text">'+public+language+'</p>'
        html += '</a>';
    });
    $('#collapseTwo .loading').attr('style', 'display:none');
    $('#collapseTwo #result').attr('style', 'display:block');
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

/**
 * submitGist()
 *
 * @param type
 */
function submitGist(type)
{
    event.preventDefault();

    var public = (type == 'public') ? true : false;
    var data = getJsonObjectCreateGist(public);
    data = JSON.stringify(data);

    github.authorize(function(){
        var resource = 'gists';
        var url = apiUrl+resource;
        sendRequest(url, createGistReturn, github.getAccessToken(), data);
    });
}

/**
 *
 * @param data
 */
function createGistReturn(data)
{
    console.log('gist created ...');
    var data = JSON.parse(data.responseText);
    var htmlUrl = data.html_url;

    $('#collapseOne .alert').removeClass('alert-warning');
    $('#collapseOne .alert').addClass('alert-success');
    $('#message-add-gist').after('<span class="html-url">'+htmlUrl+'</span>');
    $('#collapseOne .alert').fadeIn('slow');
}

/**
 * getJsonObjectCreateGist()
 * @param type
 * @returns {Object}
 */
function getJsonObjectCreateGist(public)
{
    var data = new Object();
    data.description = gistDescription.value;
    data.public = public;
    data.files = new Object();
    data.files[gistFilename.value] = {"content": gistContent.value};

    return data;
}

$(function () {
    $("[data-toggle='tooltip']").tooltip();
    if(!github.hasAccessToken()) {
       $('#message-add-gist').html('Please, login github first to authorize the app.');
       $('#collapseOne .alert').removeClass('alert-success');
       $('#collapseOne .alert').addClass('alert-warning');
       $('#collapseOne .alert').fadeIn('slow');
    }
});

window.addEventListener("DOMContentLoaded", function () {
    refresh = document.querySelector("#refresh");
    submitPrivate = document.querySelector("#submit-private");
    submitPublic = document.querySelector("#submit-public");
    gistDescription = document.querySelector("#inputDescription");
    gistFilename = document.querySelector("#inputFilename");
    gistContent = document.querySelector("#textareaContent");

    //clicking refresh action
    refresh.addEventListener("click", function(){
        getGists();
    });

    //submit private gist
    submitPrivate.addEventListener("click", function(event){
        submitGist('private')
    });

    //submit public gist
    submitPublic.addEventListener("click", function(event){
        submitGist('public')
    });

    gistFilename.addEventListener('keyup', function(event){
        this.value = this.value.replace(/[^A-Za-z.]/g,"");
    });
});