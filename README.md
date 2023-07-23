# VoipNodeJS
1- voip.js : 
this file is main file of project and runs the app

2- AsteriskAmi.js :
In this file we first connect to asterisk (voip server) with "asterisk_ami_client" library
then we filter data and send it to ("tws" with axios)  and  (front with websocket) 

----module.exports.logMessage = logMessage;-----
exports logMessage for use in websocket or other files of project 



-->Event.event     
 ------cdr وقتی تماس تموم میشه 
 
 
 ------NewConnectedLine وقتی یک تماس بر قرار میشه 
 
 
 ------NewCallerid وقتی یک تماس بر قرار میشه
 
 
  ): .باقی حالت هاش به خاظر دیتای ناقص بدرد نمیخورن 
  
  
  Note :>>  the object type in cdr is diffrent with others so we have a condition for creating object in "sendLog" function  

 ---> methods :
 handleEvent ---> اولین متدی که بعد از گرفتن دیتا از استریسک صدا زده میشه 
 کارش اینه که اگر نماس تمام شده بود و ایونبش سی دی ار بود متد ذخیره رو صدا کنه
 
 
 insVoipLog ----> insert data into tws app 
 
 sendLog ----> 
 در صورتی که حالت ایونت تو یکی از حالتای درستش باشه یک ابجکت میسازه برای سوکت
 
 
 
 
 
 
  
  