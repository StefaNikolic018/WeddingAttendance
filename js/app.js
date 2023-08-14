// Client ID and API key from the Developer Console
var CLIENT_ID = '1076498881920-o8nkhns0re30fmv6li9nh73bj2549df4.apps.googleusercontent.com';
var API_KEY = 'AIzaSyC1m7K4d-eji-lqr9_gkO1Tvnl-KtHMHF8';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS =["https://sheets.googleapis.com/$discovery/rest?version=v4"];
//Authorization scopes required by the API; 
//see all scopes on site: 
//https://developers.google.com/sheets/api/guides/authorizing
var SCOPES = https://www.googleapis.com/auth/spreadsheets.readonly"; 
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var username = document.getElementById('username');
//Entry point, called to load the auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
} 
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES  
  }).then(function () {
    
    //Listen for sign-in state changes.                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);     
    //Handle the initial sign-in state.        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());    
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;  
  });
}
function updateSigninStatus(isSignedIn) {
  clearOrders();
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listOrders();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
} 
function listOrders() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1Y8fC315JHUw8nt19xcFDvMUYHsGd3lhmyUNDXta06BU',
    range: 'order!A1:J',
  }).then(function(response) {
    var range = response.result;
    if (isUserAuthorized()) {
        var userEmail = getUserEmail();
        if (userEmail) {
          if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
              // filter only user’s orders
              // ! it is not secure to filter orders on client side
              if (range.values[i][0] === userEmail || i === 0)  {
                var row = range.values[i];
                var data = "";
                for (j = 0; j < row.length; j++) {
                  data = data + '<td>'+row[j]+'</td>'
                }
                $('#table_div > tbody:first').append('<tr>'+ data +'</tr>'); 
                data = "";
              }
            }
          }
        }
    }
  }, function(response) {
     console.log(response);
  });
}