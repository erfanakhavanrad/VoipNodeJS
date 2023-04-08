const AmiClient = require('asterisk-ami-client')
const main = require('./main');
const axios = require('axios');
const sleep = require('sleep-promise');
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
      .on('response', response => console.log(response)) // show response logs in terminal
      .on('disconnect', () => console.log('disconnect')) // show disconnection logs in terminal
      .on('reconnection', () => console.log('reconnection')) // show reconnection logs in terminal
      .on('internalError', error => console.log(error)) // show AMI error logs in terminal
  })
  .catch(error => console.log(error))



function handleEvent(event) {
  sendLog(event)

  if (event.Event === 'Cdr') {
    if (event.Disposition !== 'CONGESTION') {
      insVoipLog(event)
    }
  }
}




function insVoipLog(event) {
  try {

    var caller = event.CallerID.replace("<", "/ ").replace(">", "").replace("\"", "").replace("\"", "");
    event.CallerID = caller
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
      // headers: {
      //   Authorization: 'Bearer ' + main.token
      // }
    })
  } catch (error) {
    console.log(error)
  }
}

function sendLog(event) {
  if (main.internalNumber == null) { exports.logMessage = null}
  else {
    if ( event.ConnectedLineNum == main.internalNumber || event.CallerIDNum == main.internalNumber) {
      console.log(event)
        var logMessage = event.ConnectedLineName + " با شماره  " + event.ConnectedLineNum + " در حال تماس با  " + event.CallerIDNum + "/" + event.CallerIDName + " است"
        module.exports.logMessage = logMessage;
      if (event.Event === "Hangup") {
        console.log('hanged up')
        exports.logMessage = null
      }
    }
  }

}

sockserver.on('connection', ws => {
  // console.log('New client connected!')
  // console.log(exports.logMessage)

  ws.send(exports.logMessage)
  // ws.on('close', () => console.log('Client has disconnected!'))
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

