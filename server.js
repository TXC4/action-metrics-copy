const metrics = require('./metrics');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

urlOpen = "https://app.propertyware.com/pw/00a/2458353664/JSON?3PHJqRj";
urlClosed = "https://app.propertyware.com/pw/00a/2458353665/JSON?8TKZQMr";
urlUnassigned = "https://app.propertyware.com/pw/00a/2458353668/JSON?9EyeuDT";
urlAll = "https://app.propertyware.com/pw/00a/2469658624/JSON?9ZjKRYo";

function getDefaultMaxDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? "0" + m : m;
    var dd = d < 10 ? "0" + d : d;
    return "" + y + "-" + mm + "-" + dd;
}

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

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})