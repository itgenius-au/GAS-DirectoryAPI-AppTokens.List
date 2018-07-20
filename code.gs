function main() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()  
  var users = AdminDirectory.Users.list({customer: 'my_customer'}).users;
  var userToken, userTokens, element, driveAccess;
  var headers = [], domainTokens = [], data  = [];
  
  //  Prepare the Sheet headers
  headers.push(["Primary Email", "App Name", "Drive Access", "Token"]);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  
  //  Get the token for each users
  if(users)
    for each(var user in users){
      userTokens = AdminDirectory.Tokens.list(user.primaryEmail,{'fields': "items(clientId,displayText,scopes)"}).items;
      for each (userToken in userTokens){
        userToken['userKey'] = user.primaryEmail; // change userKey to primaryEmail
        if(userToken.displayText.indexOf("AODocs") > -1){
          Logger.log("Found AODocs");
        }
      }
      domainTokens = domainTokens.concat(userTokens);
    }
  //  Convert tokens to Sheet data and print
  if(domainTokens)
    for each(var domainToken in domainTokens){
      for each (var scope in domainToken.scopes){
        if(scope == "https://www.googleapis.com/auth/drive")
           driveAccess = "Yes";
        else
           driveAccess = "No";
      }
      data.push([domainToken.userKey, domainToken.displayText, driveAccess, domainToken.clientId]);
    }
  data.sort();
  if(data)
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}