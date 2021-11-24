const initialScreen = document.getElementById('initialScreen');
const lobbyScreen = document.getElementById('lobbyScreen');
const loadingScreen = document.getElementById('loadingScreen');
const joinForm = document.getElementById('joinForm');
const inputForm = document.getElementById('inputField');
const joinLink = document.getElementById('joinLink');
const userList = document.getElementById('users');
const copyButton = document.getElementById('copyButton');
const joinGameBtn = document.getElementById('joinGameButton');

//Get username and room from URL
/*
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
*/
//location.href = "./index.html?room=hubbabuuba";
const ADDRESS = "https://angusmclean24.github.io/io-game/";
const URL = "wss://slime-io-game.glitch.me/";
const socket = io(URL);


//User info
var username = null;
var sessionID = null;
var room = null;
var host = false;

//messages from server

//when connection is established
socket.on('connect', function() {
    sessionID = socket.id;
    showLobbyScreen();
});

//if connection lost
socket.on('disconnect', function() {
    socket.disconnect();
    showInitialScreen();
    username = null;
    sessionID = null;
    room = null;
    host = false;
});

socket.on('room', function(room){
    room = room;
    displayJoinLink(room);
});

socket.on('roomUsers', (users) => {
    outputUsers(users);
    console.log(users);
});

socket.on('makeHost', (ishost) => {
    host = ishost
});

//Dom input listeners
joinForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    var target = evt.explicitOriginalTarget || evt.relatedTarget || document.activeElement || {};
    var buttonClicked = target.dataset['clicked'];

    username = inputForm.value
    if (username == ""){
        inputForm.classList.add("is-invalid");
    } else {
        //can connect
        socket.connect();
        showLoadingScreen();
        room = location.search.replace("?","");

        //if host
        if (buttonClicked == "host") {
            host = true
        }

        socket.emit('sendUser', { username, room, host });
    }  
}, true);

//copyButton.addEventListener("click", console.log("hello"));



//Dom functions
function showLoadingScreen(){
    initialScreen.style.display = "none";
    loadingScreen.style.display = "block";   
    lobbyScreen.style.display = "none";   
}

function showLobbyScreen (){
    initialScreen.style.display = "none";
    loadingScreen.style.display = "none";   
    lobbyScreen.style.display = "block";   
}

function showInitialScreen (){
    initialScreen.style.display = "block";
    loadingScreen.style.display = "none";   
    lobbyScreen.style.display = "none";   
}

function displayJoinLink (room) {
    joinLink.value = `${ADDRESS}?${room}`;
}

function copyLink() {
    /* Get the text field */
    //var copyText = document.getElementById("myInput");
  
    /* Select the text field */
    joinLink.select();
    joinLink.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(joinLink.value);
}

function outputUsers(users){
    var text = null
    for (let i =0; i < users.length; i++){
        var toplace = users[i].username;
        if (users[i].ishost) {
            toplace += " (host)";
        }

        if (users[i].id == sessionID) {
            toplace += " (you)";
        }

        if (text == null){
            text = `<li>${toplace}</li>`
        } else {
            text += `<li>${toplace}</li>`;
        }
        
    }
    userList.innerHTML = text;
}   


 
