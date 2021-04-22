const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../models");
const cache = db.Cache;

const { Op } = require('sequelize');

router.get('/orm', async (req, res) => {

    const data = {
        url: 'https://www.gatineau.ca/upload/donneesouvertes/BORNE_FONTAINE.xml',
        content: 'testing',
        lastFetch: Date.now()
    };

    await cache.create(data);
    res.json(data);

});

router.get('/hydrantsx', async (req, res) => {
    const url = 'https://www.gatineau.ca/upload/donneesouvertes/BORNE_FONTAINE.xml';

    data - await cache.findAll({
        order: [['lastFetch', 'DESC']],
        where: {
            [Op.and] : [
                {url:url},
                {
                    lastFetch: {
                        [Op.gte]: new Date(new Date() - 24*60*60*1000)
                    }
                }
            ]
        }
    });

    if(data.length <= 0) {
        const d= await axios.get(url, {
            responseType: 'text'
        });

        const data = {
            url: url,
            content: d.data,
            lastFetch: Date.now()
        };

        await cache.create(data);

        res.send(d.data);
    } else {
        res.send(data[0].content);
    }

});

router.get('/geo', async (req, res) => {

    let ip = req.socket.remoteAddress;
    console.log(ip);
    if (ip == "::1" || ip.includes("::ffff")) {
        ip = "74.56.113.25";
    }
    let loc = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=c1ffe1b2e1fc4d97a5bff2672ea154c7&ip=${ip}`);
    // console.log(loc.data);

    res.json(loc.data);
});


router.get('/hydrants', async (req, res) => {

    const d = await axios.get('https://www.gatineau.ca/upload/donneesouvertes/BORNE_FONTAINE.xml', {
        responseType: 'text',
        transformResponse: [v => v]
    });

    // let result = convert.xml2json(d.data, [compact: true, spaces: 0])
    res.send(d.data);

});

module.exports = router;