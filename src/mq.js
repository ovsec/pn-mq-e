'use strict';

// Import the MQ package
//import * as mq from 'ibmmq';

var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.

//var qMgr = "QM1";
//var qName = "DEV.QUEUE.1";




var ghObj;
var ghConn;

function formatErr(err) {
    return "MQ call failed in " + err.message;
}

// When we're done, close queues and connections
function cleanup(hConn, hObj) {
    mq.Close(hObj, 0, function (err) {
        if (err) {
            console.log("Cleanup: ", formatErr(err));
        } else {
            console.log("MQCLOSE successful");
        }
        mq.Disc(hConn, function (err) {
            if (err) {
                console.log("Cleanup: ", formatErr(err));
            } else {
                console.log("MQDISC successful");
            }
        });
    });
}
function put(connectionName, qMgr, channel, qName, logger) {


console.log = logger ? logger : console.log;


// The program really starts here.
// Connect to the queue manager. If that works, the callback function
// opens the queue, and then we can put a message.

console.log("PN MQ start");



var cno = new mq.MQCNO();
var cd = new mq.MQCD();
cd.ConnectionName = connectionName;
cd.ChannelName = channel;
// Make the MQCNO refer to the MQCD
cno.ClientConn = cd;
//cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client
// MQ V9.1.2 allows setting of the application name explicitly
if (MQC.MQCNO_CURRENT_VERSION >= 7) {
    cno.ApplName = "PN IBMMQ";
}

// To add authentication, enable this block
if (false) {
    var csp = new mq.MQCSP();
    csp.UserId = "metaylor";
    csp.Password = "passw0rd";
    cno.SecurityParms = csp;
}

// The Promise versions of the verbs make it easy to chain
// the operations without getting buried in nested callbacks.
// Note that some of the Promises do not return any parameters
// on success.
mq.ConnxPromise(qMgr, cno)
    .then(hConn => {
        console.log("MQCONN to %s successful ", qMgr);
        ghConn = hConn;
        var od = new mq.MQOD();
        od.ObjectName = qName;
        od.ObjectType = MQC.MQOT_Q;
        var openOptions = MQC.MQOO_OUTPUT;
        return mq.OpenPromise(hConn, od, openOptions);
    })
    .then(async hObj =>  {
        console.log("MQOPEN of %s successful", qName);
        
        var msg = "Hello from Node at " + new Date();

        var mqmd = new mq.MQMD(); // Defaults are fine.
        var pmo = new mq.MQPMO();
        // Describe how the Put should behave
        pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
            MQC.MQPMO_NEW_MSG_ID |
            MQC.MQPMO_NEW_CORREL_ID;

        ghObj = hObj;
        return mq.PutPromise(hObj, mqmd, pmo, msg);
    })
    .then(() => {
        console.log("MQPUT successful");
        return mq.ClosePromise(ghObj, 0);
    })
    .then(() => {
        console.log("MQCLOSE successful");
        return mq.DiscPromise(ghConn);
    })
    .then(() => { console.log("Done."); })
    .catch(err => {
        console.log(formatErr(err));
        cleanup(ghConn, ghObj);
        // Do stuff
        
    });
}
module.exports = put
//put('sapmqtest111.postdk.net(1415)', 'SAPMQ1', 'C.TO.SAPMQ', 'OIO.INPUT.FROM.KMD.PTST')