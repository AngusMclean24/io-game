const initialScreen = document.getElementById('initialScreen');
const lobbyScreen = document.getElementById('lobbyScreen');
const joinForm = document.getElementById('joinForm');
const inputForm = document.getElementById('inputField');
const joinLink = document.getElementById('joinLink');
const userList = document.getElementById('users');

const joinGameBtn = document.getElementById('joinGameButton');

//Get username and room from URL
/*
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
*/
//location.href = "./index.html?room=hubbabuuba";

const URL = "wss://slime-io-game.glitch.me/";
const socket = io(URL);

//User info
var username = null
var sessionID = null
var room = null

//messages from server
socket.on('connect', function() {
    sessionID = socket.id;
});

socket.on('room', function(room){
    room = room;
    displayJoinLink(room);
});

socket.on('roomUsers', (users) => {
    outputUsers(users);
});


//Dom input listeners
//if want to join a specific room
joinForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    var target = evt.explicitOriginalTarget || evt.relatedTarget || document.activeElement || {};
    var buttonClicked = target.dataset['clicked'];

    username = inputForm.value
    if (username == ""){
        inputForm.classList.add("is-invalid");
    } else {
        //if host
        if (buttonClicked == "host") {
            socket.emit('getRoom', { username });
        } else {
        //if trying to join specific room
            room = location.search.replace("?","");;
            displayJoinLink(room);
            socket.emit('joinRoom', { username, room })
        } 
        joinLobby()
    }
    
}, true);

//if want to become host



//Dom functions
function joinLobby (){
    initialScreen.style.display = "none";
    lobbyScreen.style.display = "block";   
}

function displayJoinLink (room) {
    joinLink.value = `${URL}?${room}`;
}

function outputUsers(users){
    console.log(users)
    var text = null
    for (let i =0; i < users.length; i++){
        if (text == null){
            text = `<li>${users[i].username}</li>`
        } else {
            text += `<li>${users[i].username}</li>`;
        }
        
    }
    console.log(text);
    userList.innerHTML = text;
}   
