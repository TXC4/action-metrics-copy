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

// app.get('/', (req, res) => {
//     //res.sendFile(__dirname + "/index.html");
//     (async () => {
//         const fetchResponse = await fetch(urlOpen);
//         const json = await fetchResponse.json();
//         res.render('displayDataOpen', { data: json });
//     })();
// })

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post('/', (req, res) => {
    if (req.body.username == "Harold" && req.body.password == "Action361!") {
        (async () => {
            const fetchResponse = await fetch(urlOpen);
            const json = await fetchResponse.json();
            res.render('displayDataOpen', { data: json });
        })();
    }
})

app.post('/reports', (req, res) => {
    if (req.body.whichButton == "Opened") {
        (async () => {
            const fetchResponse = await fetch(urlOpen);
            const json = await fetchResponse.json();
            let jsonCopy = json;
            if (req.body.minDate) {
                jsonCopy = { ...jsonCopy, minDate: req.body.minDate };
            }
            if (req.body.maxDate) {
                jsonCopy = { ...jsonCopy, maxDate: req.body.maxDate };
            }
            res.render('displayDataOpen', { data: jsonCopy });
        })();
    }
    else if (req.body.whichButton == "Closed") {
        (async () => {
            const fetchResponse = await fetch(urlClosed);
            const json = await fetchResponse.json();
            let jsonCopy = json;
            if (req.body.minDate) {
                jsonCopy = { ...jsonCopy, minDate: req.body.minDate };
            }
            if (req.body.maxDate) {
                jsonCopy = { ...jsonCopy, maxDate: req.body.maxDate };
            }
            res.render('displayDataClosed', { data: jsonCopy });
        })();
    }
    else if (req.body.whichButton == "Unassigned") {
        (async () => {
            const fetchResponse = await fetch(urlUnassigned);
            const json = await fetchResponse.json();
            let jsonCopy = json;
            if (req.body.minDate) {
                jsonCopy = { ...jsonCopy, minDate: req.body.minDate };
            }
            if (req.body.maxDate) {
                jsonCopy = { ...jsonCopy, maxDate: req.body.maxDate };
            }
            res.render('displayDataUnassigned', { data: jsonCopy });
        })();
    }
    else {
        (async () => {
            const fetchResponse = await fetch(urlOpen);
            const json = await fetchResponse.json();
            res.render('displayDataOpen', { data: json });
        })();
    }
})

function getDefaultMaxDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? "0" + m : m;
    var dd = d < 10 ? "0" + d : d;
    return "" + y + "-" + mm + "-" + dd;
}

app.post('/stats', (req, res) => {
    (async () => {
        const fetchResponse = await fetch(urlAll);
        const json = await fetchResponse.json();
        let jsonCopy = json;
        if (req.body.minDate) {
            jsonCopy = { ...jsonCopy, minDate: req.body.minDate };
        } else {
            jsonCopy = { ...jsonCopy, minDate: "2021-05-01" };
        }
        if (req.body.maxDate) {
            jsonCopy = { ...jsonCopy, maxDate: req.body.maxDate };
        } else {
            jsonCopy = { ...jsonCopy, maxDate: getDefaultMaxDate() }
        }
        res.render('stats', { data: jsonCopy });
    })();
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
})