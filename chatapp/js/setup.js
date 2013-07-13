$(document).ready(function () {
  fetch(currentRoom);
  $('#usernameField').val(getUsername());
  msgIntervalID = setInterval(function () {
    fetch(currentRoom);
  }, 3000);

  $('#usernameSubmit').on('click', function(e) {
    window.location.search = 'username=' + $('#usernameField').val();
  });

  $('#textSubmit').on('click', function (e) {
    e.preventDefault();
    msg = $('#msgField').val();
    if (msg.length > 0) send(msg);
    $('#msgField').val('');
  });

  $('#chatroomSubmit').on('click', function (e) {
    //should have a way to detect duplicate chatroom names
    e.preventDefault();
    roomName = $('#chatroomField').val();
    var $room = $('<div class="chatroom"></div>');
    $room.text(roomName);
    $room.attr('id', roomName);
    $room.addClass('currentRoom');
    currentRoom = roomName;
    $('.chatroom').each(function() {$(this).removeClass('currentRoom');});
    $('#chatroomField').val('');
    $room.appendTo('#rooms');
  });

  $(document).delegate('.chatroom', 'click', function () {
    $('.chatroom').each(function() {$(this).removeClass('currentRoom');});
    $(this).addClass('currentRoom');
    currentRoom = $(this).attr('id');
  });

  $(document).delegate('.usr', 'click', function () {
    if (friendList[$(this).attr('data-usr')]) {
      friendList[$(this).attr('data-usr')] = false;
    } else {
      friendList[$(this).attr('data-usr')] = true;
      $('.msg').each(function () {
        if (friendList[$(this).attr('data-usr')]) {
          $(this).toggleClass('friend', true);
        }
      });
    }
  });

});

//Bad global variables, obvious vulnerability in client.
if (!lastTime) var lastTime = '0';
var friendList = {};
if (!currentRoom) var currentRoom = 'messages';

var fetch = function (time) {
  $.ajax('http://127.0.0.1:8080/classes/'+ currentRoom, {
    contentType: 'application/json',
    type: "GET",
    success: function(data){
      //The following is a crude way of clearing the chat field and
      //loading new messages. Later I will implement date parsing as
      //found in the 2013-06-chat-client repo, or a similar method.
      for (var i = 0; i < data.length; i++) {
        if (parseInt(data[i].createdAt) > parseInt(lastTime)) {
          makeMsg(data[i]);
        }
      }
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var makeMsg = function (data) {
  if (data.id) {
    var $msg = $('<span class="msg"></span>');
    var $usr = $('<span class="usr"></span>');
    $msg.text(data.message);
    $usr.text(data.username);
    $usr.attr('data-usr', data.username);
    $msg.attr('data-usr', data.username);
    if (friendList[data.username]) {
      $msg.addClass('friend');
    }
    $usr.prependTo($msg);
    $msg.prependTo('#viewMsgs');
    lastTime = data.createdAt;
  }
};

var getUsername = function(){
  var results = new RegExp('[\\?&]username=([^&#]*)').exec(window.location.href);
  return results[1] || 0;
};

var send = function (msgText) {
  console.log('sending...');
  var usr = getUsername();
  return $.ajax({
    contentType: 'application/json',
    type:"POST",
    url: "http://127.0.0.1:8080/classes/"+currentRoom,
    data: JSON.stringify({message: msgText, username: usr, createdAt: Date.now()})
  });
};

if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}