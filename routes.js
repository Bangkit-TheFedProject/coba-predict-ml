const EggPredictionController = require('./EggPredictionController');

const routes = [
    {
        method : 'POST',
        path : '/predict',
        handler : EggPredictionController.predict,
        options : {
            payload : {
                multipart : true,
                output: 'file',
                parse : true,
                allow: 'multipart/form-data'
            },
            log : {
                collect : true
            }
        }
    }
];

module.exports = routes;