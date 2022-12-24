import fetch from "node-fetch";
import HttpProxyAgent from "http-proxy-agent";
import * as http2 from "http2";
function getTokenFromCode(code) {
    return fetch('https://tyb.qingyou.ren/auth/?code=' + code, {
        method: 'POST',
        agent: new HttpProxyAgent('http://127.0.0.1:8888'),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: ''
    })
        .then(res => res.json())
        .then(res => new Promise((resolve, reject) => {
            res.success ? resolve(res.data) : reject(res);
        }))
}

function h() {
    const req = http2.request({
        method: 'POST',
        host: 'tyb.qingyou.ren',
        path: '/auth/?code=063UF6100qLpYO1UPy1007Aasz3UF61L'
    });
    req.end(); // Send it

    req.on('response', (headers, flags) => {
        for (const name in headers) {
            console.log(`${name}: ${headers[name]}`);
        }
    });

    req.setEncoding('utf8');
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        console.log(`\n${data}`);
        client.close();
    });
}
h();

// let result = await getTokenFromCode('063UF6100qLpYO1UPy1007Aasz3UF61L');
// console.log(result);
