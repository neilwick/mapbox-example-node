const express = require('express');
const path = require('path');
const dbLayer = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9000;
const cors = require("cors");
const axios = require("axios");
// const convert = require("xml-js");

const User = require('./model/User');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/hydrants', async (req,res) => {

	const d = await axios.get('https://www.gatineau.ca/upload/donneesouvertes/BORNE_FONTAINE.xml', {
		responseType: 'text',
		transformResponse: [v => v] 
	});

	// let result = convert.xml2json(d.data, [compact: true, spaces: 0])
	res.send(d.data);

})

app.get('/geo', async (req, res) => { 

	let ip = req.socket.remoteAddress;
	console.log(ip);
	if(ip == "::1" || ip.includes("::ffff")) {
		ip = "74.56.113.25";
	}
	let loc = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=c1ffe1b2e1fc4d97a5bff2672ea154c7&ip=${ip}`);
	// console.log(loc.data);
	
	res.json(loc.data);
});

app.listen(port, () => {
	console.log(`listening on port: ${port}`);
});
