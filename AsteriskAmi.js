const AmiClient = require('asterisk-ami-client')
// import AmiClient from 'asterisk-ami-client'
// import main from './main'
// import axios from 'axios'
const main = require('./main');
const axios = require('axios');
// const { json } = require('express');
const voip = new AmiClient()

voip.connect('admin', '0938204386', { host: '172.16.10.1', port: 5038 })
// voip.disconnect()
  .then(() => {
    voip
      .on('connect', () => console.log('connect')) // show connection logs in terminal
      .on('event', event => save(event)
      )
    //   .on('response', response => console.log(response)) // show response logs in terminal
      .on('disconnect', () => console.log('disconnect')) // show disconnection logs in terminal
      .on('reconnection', () => console.log('reconnection')) // show reconnection logs in terminal
      .on('internalError', error => console.log(error)) // show AMI error logs in terminal
  })
  .catch(error => console.log(error))

function save (event) {
// console.log('AAAAAAAAA' +  main.token)
// console.log('BBBBBBBBB' + main.internalNumber)

  sendLog(event)
  if (event.Event === 'Cdr') {
   
    // JSON.stringify(params)
    // console.log(params)
    try {
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
      },{
        headers: {
          Authorization: 'Bearer ' + main.token
        }
      })
    } catch (error) {
      console.log(error)
    }
    // console.log(event)
  }
}
var logMessage = null   
// console.log(token)
// var logMessage = "user" + "event.CallerID" + "calling" +" event.CallerID"

function sendLog (event) {
    // var logMessage = "user" + "event.CallerID" + "calling" +" event.CallerID"
    // console.log(event) 
    // if (event.CallerID.includes("130") || event.Source.includes("130") ) {
    var logMessage = "user " + event.CallerID + " calling " + event.Destination
  // }
module.exports.logMessage = logMessage;

}
