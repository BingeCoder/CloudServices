var Twit = require('twit');
var config = require('../config.js');

var twitter = new Twit(config);

const postTwitter = (message) => {
    return new Promise((resolutionFunc, rejectionFunc) => {
        if (message) {
            twitter.post('statuses/update', message, function tweet(error, data, response) {
                if (error) {
                    rejectionFunc(error);
                } else {
                    resolutionFunc(response);
                }
            });
        } else {
            rejectionFunc();
        }
    });
}

module.exports = postTwitter;
