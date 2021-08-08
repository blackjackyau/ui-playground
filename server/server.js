const express = require('express');
const cfg = require('./config');
const cors = require('cors');
const axios = require('axios');

module.exports = () => {

    const app = express();
    const router = express.Router();

    const corsOptions = {
        origin: (origin, callback) => {
            callback(null, true);
        },
        credentials: true,
        maxAge: 3600,
    };

    app.use(cors(corsOptions));

    app.use(express.json())

    app.use('/api', router);

    app.use(express.static("docs"));

    app.use((request, response, next) => {

        const requestStart = Date.now();

        let errorMessage = null;
        let body = [];
        request.on("data", chunk => {
            body.push(chunk);
        });
        request.on("end", () => {
            body = Buffer.concat(body).toString();
        });
        request.on("error", error => {
            errorMessage = error.message;
        });

        response.on("finish", () => {
            const { rawHeaders, httpVersion, method, socket, url } = request;
            const { remoteAddress, remoteFamily, _peername } = socket;

            const { statusCode, statusMessage } = response;
            const headers = response.getHeaders();

            console.log({
                timestamp: Date.now(),
                processingTime: Date.now() - requestStart,
                rawHeaders,
                body,
                errorMessage,
                httpVersion,
                method,
                remoteAddress,
                remoteFamily,
                url,
                response: {
                    statusCode,
                    statusMessage,
                    headers,
                    _peername
                }
            }
            );
        });

        next();
    });

    router.get('/user', (req, res) => {
        const ttl = 1000;
        const delay = req.query.delay ? req.query.delay : 0; 
        res.setHeader('cache-control', `public, max-age=${ttl}`);
        res.setHeader('Vary', "accept-language");
        res.setHeader('expires', new Date(Date.now() + ( ttl * 1000 )).toUTCString());
        setTimeout(() => {
            res.status(200).json({
                "name": "lalaking",
                "age": 10,
                "lang": req.headers["accept-language"]
            })
        }, delay)
    });

    router.get('/verboser.js', (req, res) => {
        const delay = req.query.delay ? req.query.delay : 0;
        res.setHeader('content-type', "application/javascript; charset=utf-8");
        setTimeout(() => {
            res.status(200).send(
                `console.log("verbose-${req.query.v} @ " + new Date()); window.recorder.push("verbose-${req.query.v} @ " + new Date());`
            )
        }, delay)
    });

    app.listen(cfg.PORT, () => {
        console.log(`Backend server is running at port:${cfg.PORT}`);
    });

}