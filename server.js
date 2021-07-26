const metrics = require('./metrics');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Insert API URL
urlAll = "";

// Get today's date as Max Date
function getDefaultMaxDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? "0" + m : m;
    var dd = d < 10 ? "0" + d : d;
    return "" + y + "-" + mm + "-" + dd;
}

// Get initial stats page with default data
app.get('/', (req, res) => {
    (async () => {
        const fetchResponse = await fetch(urlAll);
        const json = await fetchResponse.json();

        let jsonCopy = json;
        jsonCopy = { ...jsonCopy, minDate: "2021-06-01" };
        jsonCopy = { ...jsonCopy, minShowDate: "2021-06-01" };
        jsonCopy = { ...jsonCopy, maxDate: getDefaultMaxDate() }
        
        var showData = metrics.runMetrics(jsonCopy);
        showData.minDate = "2021-06-01";
        showData.minShowDate = "2021-06-01";
        showData.maxDate = getDefaultMaxDate();

        res.render('stats', { data: showData });
    })();
});

// Get stats page with custom data on 'Go' button
app.post('/stats', (req, res) => {
    (async () => {
        const fetchResponse = await fetch(urlAll);
        const json = await fetchResponse.json();
        let jsonCopy = json;
        if (req.body.minDate) {
            jsonCopy = { ...jsonCopy, minDate: req.body.minDate };
        } else {
            jsonCopy = { ...jsonCopy, minDate: "2021-06-01" };
        }
        if (req.body.minShowDate) {
            jsonCopy = { ...jsonCopy, minShowDate: req.body.minShowDate };
        } else {
            jsonCopy = { ...jsonCopy, minShowDate: "2021-06-01" };
        }
        if (req.body.maxDate) {
            jsonCopy = { ...jsonCopy, maxDate: req.body.maxDate };
        } else {
            jsonCopy = { ...jsonCopy, maxDate: getDefaultMaxDate() }
        }
        var showData = metrics.runMetrics(jsonCopy);
        showData.minDate = jsonCopy.minDate;
        showData.minShowDate = jsonCopy.minShowDate;
        showData.maxDate = jsonCopy.maxDate;
        res.render('stats', { data: showData });
    })();
})

// Listen on port hosted else 3000
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})