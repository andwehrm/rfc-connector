const express = require('express')
const noderfc = require('node-rfc')
const prompt = require('prompt');
const session = require('express-session')
const bodyParser = require('body-parser');

var stateful_client;

const app = express()
const port = 1080

app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', verify: (req, res, buf) => {
  req.rawBody = buf
}})); 

app.use(bodyParser.text({type: "*/*" , limit: '100mb', verify: (req, res, buf) => {
  req.rawBody = buf
}}))

app.use(session({
  secret: 'secretSTATEFUL',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

var username;
var password;
var sysnr;
var client;
var ashost;

function onErr(err) {
    console.log(err);
    return 1;
  }

const properties = [
  {
    name: 'username',
    validator: /^[a-zA-Z\s-]+$/,
    warning: 'Username must be only letters, spaces, or dashes'
  },
  {
    name: 'sysnr',
    validator: /^\d\d$/,
    warning: 'sysnr must be a 2 digit number number from 00 to 99'
  },
  {
    name: 'client',
    validator: /^\d\d\d$/,
    warning: 'Client must be a 3 digit number number from 001 to 999'
  },
  {
    name: 'ashost'
  },
  {
    name: 'password',
    hidden: true,
    replace: '*',
  },
];

function request_rfc(method, req, res){
    (async () => {
        try {
            var clnt;
            var stfl = false;

            for (const key in req.headers) {
              if(req.headers[key].includes("stateful")){
                stfl = true;
              }
            }

            if(stfl === true){
              clnt = stateful_client;
            }
            else{
              clnt =  new noderfc.Client({stateful: false, user: username , passwd: password, sysnr: sysnr, client: client, ashost: ashost })
              await clnt.open();
            }

            const request_line = {
                METHOD: method,
                URI: req.url,
                VERSION: "HTTP/1.1"
            }
            let headers = [];

            for (const key in req.headers) {
                headers.push({NAME: key, VALUE: req.headers[key]})
            }

            var sadt_request;
            if(Object.keys(req.body).length < 1)
            {
              sadt_request = {
                REQUEST_LINE :  request_line,
                HEADER_FIELDS : headers,
                MESSAGE_BODY : new Buffer(2)
            };
            }
            else
            {
            sadt_request = {
                REQUEST_LINE :  request_line,
                HEADER_FIELDS : headers,
                MESSAGE_BODY : new Buffer(req.rawBody.toString("utf8"))
            };
           }

            const result = await clnt.call("SADT_REST_RFC_ENDPOINT", {
                REQUEST : sadt_request,
            });

            res.statusCode = result.RESPONSE.STATUS_LINE.STATUS_CODE;

            result.RESPONSE.HEADER_FIELDS.forEach(header => {
             res.set(header.NAME, header.VALUE);
            });

            const body = result.RESPONSE.MESSAGE_BODY.toString();

            res.send(body);
        } catch (err) {
            console.error(err);
        }
    })();
}

prompt.start();

prompt.message = "";

prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }

  username = result.username;
  password = result.password;
  sysnr = result.sysnr;
  client = result.client;
  ashost = result.ashost;

  stateful_client =  new noderfc.Client({stateful: true, user: username , passwd: password, sysnr: sysnr, client: client, ashost: ashost })
  stateful_client.open();
 
  app.get('/*', (req, res) => {
    request_rfc("GET", req, res);
  })

  app.post('/*', (req, res) => {
    request_rfc("POST", req, res);
  })

  app.put('/*', (req, res) => {
    request_rfc("PUT", req, res);
  })

  app.listen(port, () => {
    console.log(`Connector Listening on Port ${port}`)
  })
});

