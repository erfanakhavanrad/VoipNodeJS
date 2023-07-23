const AmiClient = require('asterisk-ami-client')
// const main = require('./voip');
const axios = require('axios');
const sleep = require('sleep-promise');
const { WebSocketServer } = require('ws');
const { string } = require('joi');
const sockserver = new WebSocketServer({ port: 8081 })
const voip = new AmiClient()






voip.connect('admin', '0938204386', { host: '172.16.10.1', port: 5038 })
  .then(() => {
    voip
      .on('connect', () => console.log('connect'))
      .on('event', event =>
        handleEvent(event))
      .on('response', response => console.log(response))
      .on('disconnect', () => console.log('disconnect'))
      .on('reconnection', () => console.log('reconnection'))
      .on('internalError', error => console.log(error))
  })
  .catch(error => console.log(error))



function handleEvent(event) {
	//console.log(event)
  sendLog(event)
  if (event.Event === 'Cdr') {
    if (event.Destination !== '801' && event.Destination !== '802' && event.Destination !== '803' && event.Destination !== '804' && event.Destination !== '806') {
		try{
      insVoipLog(event)
		} catch (error) {
	insVoipLog(event)
    console.log(error)
  }
}
  }
}


async function insVoipLog(event) {
  try {

    var caller = event.CallerID.replace("<", "/ ").replace(">", "").replace("\"", "").replace("\"", "");
    event.CallerID = caller
    sleep(2000)
    await axios.post('http://localhost:8001/tws/crm/voiplogs', {
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
      
    })
  } catch (error) {
    console.log(error)
  }
}

function sendLog(event) {
  
  if (event.Event !== "RTCPSent" && event.Event !== "VarSet" && event.Event !== "RTCPReceived" && event.Event !== "LocalBridge" && event.Event !== "DeviceStateChange" && event.Event !== "QueueMemberStatus" && event.Event !== "ExtensionStatus" && event.Event !== "PeerStatus" && event.Event !== "BridgeCreate") {

    // console.log(event)
    if (event.Event === 'NewConnectedLine' || event.Event === 'NewCallerid' || event.Event === 'Cdr') {
      // console.log(event.Event)

      if (event.ConnectedLineNum !== "<unknown>" && event.CallerIDNum !== "<unknown>" && event.ConnectedLineName !== "<unknown>" && event.CallerIDName !== "<unknown>") {

          CallerIDNum = event.CallerIDNum,
          CallerIDName = event.CallerIDName,
          ConnectedLineName = event.ConnectedLineName,
          ConnectedLineNum = event.ConnectedLineNum,
          CallState = event.Event
        if (event.Event === 'Cdr') {
          // console.log("its cdr")
          CallerID = event.CallerID.replace("<", "/ ").replace(">", "").replace("\"", "").replace("\"", "").split("/")[1].trim()
          Destination = event.Destination
          var logMessage = {
            CallerIDNum,
            CallerIDName,
            ConnectedLineName,
            ConnectedLineNum,
            CallerID,
            Destination,
            CallState
          };
        } else {
          var logMessage = {
            CallerIDNum,
            CallerIDName,
            ConnectedLineName,
            ConnectedLineNum,
            CallState
          };
		 // console.log(logMessage)
        }
      
        module.exports.logMessage = logMessage;
      }
    }
	//console.log(exports.logMessage)
  }
  // }
  return logMessage
}

socket.setKeepAlive(true);
sockserver.on('connection', ws => {
  console.log('New client connected!')
  console.log(exports.logMessage)
  // var test = sendLog()
  //  console.log(test)
  // while(true){
  // sleep(2000)
  ws.on('close', () => console.log('Client has disconnected!'))
  ws.send(JSON.stringify(exports.logMessage))
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

