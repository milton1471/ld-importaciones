const axios = require('axios');

const url = 'https://gold-mink-702465.hostingersite.com/wp-json/wc/v3/products';
const ck = 'ck_02fae9e3566492f8687dd4ce7ef8cc860529fcd3';
const cs = 'cs_9c3cc6270dadc7d66bc2148a6c27615b4ebb2a8f';

async function test() {
    console.log("Testing with Query String Auth...");
    try {
        const res = await axios.get(`${url}?consumer_key=${ck}&consumer_secret=${cs}`);
        console.log("Success! Found " + res.data.length + " products.");
    } catch (err) {
        console.log("Query String Auth failed: " + err.response?.status + " - " + JSON.stringify(err.response?.data));
    }

    console.log("\nTesting with Basic Auth in Headers...");
    try {
        const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
        const res = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        console.log("Success! Found " + res.data.length + " products.");
    } catch (err) {
        console.log("Basic Auth Header failed: " + err.response?.status + " - " + JSON.stringify(err.response?.data));
    }
}

test();
