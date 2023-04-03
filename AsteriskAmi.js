const AmiClient = require('asterisk-ami-client')
// import AmiClient from 'asterisk-ami-client'
// import main from './main'
// import axios from 'axios'
const main = require('./main');
const axios = require('axios');
const sleep = require('sleep-promise');
// const { json } = require('express');
// const io = require('socket.io')();
const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 8081 })
const voip = new AmiClient()






voip.connect('admin', '0938204386', { host: '172.16.10.1', port: 5038 })
  // voip.disconnect()
  .then(() => {
    voip
      .on('connect', () => console.log('connect')) // show connection logs in terminal
      .on('event', event => handleEvent(event)
      )
      //   .on('response', response => console.log(response)) // show response logs in terminal
      .on('disconnect', () => console.log('disconnect')) // show disconnection logs in terminal
      .on('reconnection', () => console.log('reconnection')) // show reconnection logs in terminal
      .on('internalError', error => console.log(error)) // show AMI error logs in terminal
  })
  .catch(error => console.log(error))



function handleEvent(event) {
  sendLog(event)

  if (event.Event === 'Cdr') {
    exports.logMessage = null
    if(event.Disposition !== 'CONGESTION' && event.Disposition !== 'FAILED' ){
      sleep(10000)
    console.log(event)
      insVoipLog(event)
    }
    // else if(event.Disposition === ''){}
  }
}




function insVoipLog(event){
  try {
      
    var caller = event.CallerID.replace("<", "/ ").replace(">", "").replace("\"", "").replace("\"", "");
    // var caller2  = caller.replace(">", "");
    // var ClearedName = clearedName.replace("\"", "")
    // var fullClearedName2 = fullClearedName.replace("\"", "")
    event.CallerID = caller
    // String[] startTime = event.getStartTime().split(" ");
    // crmVoipLogs.setStartTime(startTime[1]);
    // String[] endTime = event.getEndTime().split(" ");
    // crmVoipLogs.setEndTime(endTime[1]);
    // console.log(event.CallerID)
    // console.log(event.Destination)
    // console.log(event.Disposition)
    // console.log(event.StartTime)
    // console.log('--------------------')
  
    axios.post('http://localhost:8080/tws/crm/voiplogs', {
      Event: event.Event,
      Privilege: event.Privilege,
      AccountCode: event.AccountCode,
      Source: event.Source,
      Destination: event.Destination,
      DestinationContext: event.DestinationContext,
      CallerID: event.CallerID,
      Channel: event.Channel,
      DestinationChannel: event.DestinationChannel,
      LastApplication: event.LastApplication,
      LastData: event.LastData,
      StartTime: event.StartTime,
      AnswerTime: event.AnswerTime,
      EndTime: event.EndTime,
      Duration: event.BillableSeconds,
      BillableSeconds: event.BillableSeconds,
      Disposition: event.Disposition,
      AMAFlags: event.AMAFlags,
      UniqueID: event.UniqueID,
      UserField: event.UserField
    }, {
      headers: {
        Authorization: 'Bearer ' + main.token
      }
    })
  } catch (error) {
    console.log(error)
  }
}

function sendLog(event) {
  // var logMessage = "user" + "event.CallerID" + "calling" +" event.CallerID"
  // console.log(event) 
  // if (event.CallerID.includes("130") || event.Source.includes("130") ) {
    if(main.internalNumber != null){
    if (event.Event === "NewConnectedLine" && event.ConnectedLineNum == main.internalNumber || event.CallerIDNum == main.internalNumber ){
      // console.log(event)
      var logMessage =  event.ConnectedLineName + " با شماره  " + event.ConnectedLineNum + " در حال تماس با  " + event.CallerIDNum + "/" + event.CallerIDName + " است"
      module.exports.logMessage = logMessage;
    }}

}

sockserver.on('connection', ws => {
  console.log('New client connected!')
  console.log(exports.logMessage)

  ws.send(exports.logMessage)
  ws.on('close', () => console.log('Client has disconnected!'))
  ws.on('message', data => {
    sockserver.clients.forEach(client => {
      console.log(`distributing message: ${data}`)
      client.send(`${data}`)
    })
  })
  ws.onerror = function () {
    console.log('websocket error')
  }
})

