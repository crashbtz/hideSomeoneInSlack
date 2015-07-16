var initSelect = function() {
    var select = $('#list_users');
    chrome.storage.local.get({users: []}, function (result) {
        // so we select the key we need
        var users = result.users;
        for (var user in users) {
            select.append('<option value="'+users[user]+'">'+users[user]+'</option>');
        }
    });
};

var addUser = function(){
    $('#add').on('click', function() {
        var user = $('#user').val();
        var list = $('#list_users');
        if (list.children('option[value="'+user+'"]').length === 0) {
            chrome.storage.local.get({users: []}, function (result) {
                var users = result.users;
                users.push(user);
                chrome.storage.local.set({users: users}, function () {
                    list.append('<option value="'+user+'">'+user+'</option>');
                    sortOptions();
                });
            });
        }
        $('#user').val('');
    });
};

var removeUser = function(){
    $('#remove').on('click', function() {
        var user = $('#list_users').val();
        var list = $('#list_users');
        chrome.storage.local.get({users: []}, function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            var users = result.users;
            
            users.splice(users.indexOf(user),1);
            // set the new array value to the same key
            chrome.storage.local.set({users: users}, function () {
                $('#list_users > option[value="'+list.val()+'"]').remove();
                sortOptions();
            });
        });
    });
};

var validate = function() {
    $('#validate').on('click', function() {
        chrome.tabs.getSelected(null, function(tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {code: code});
        });
    });
};

var initEvent = function() {
    $("#msgs_div").bind('DOMSubtreeModified', function(){
        hide();
    });
};

var hide = function() {
    chrome.storage.local.get({users: []}, function (result) {
        var users = result.users;
        for (var user in users) {
            $('a[href="/team/'+users[user]+'"]').closest('div[id*="msg_"]').hide();
        }
    });
};

var sortOptions = function() {
    var options = $('#list_users option');
    var arr = options.map(function(_, o) {
        return {
            t: $(o).text(),
            v: o.value
        };
    }).get();
    arr.sort(function(o1, o2) {
        return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
    });
    options.each(function(i, o) {
        o.value = arr[i].v;
        $(o).text(arr[i].t);
    });
};

$(document).ready(function() {
    initEvent();
    addUser();
    removeUser();
    validate();
    initSelect();
});