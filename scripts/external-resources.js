const fs = require('fs')
const request = require('request');

const versions = [
    '1.11.3', '1.12.4', '2.0.3', '2.1.4',
    '2.2.4', '3.0.0', '3.1.1'
]

function Fetch(version) {
    return new Promise((resolve, reject) => {
        const source = `https://unpkg.com/jquery@${version}/dist/jquery.js`
        request(source, (err, response, body) => {
            const rootPath = `./external/jquery@${version}`
            fs.mkdir(rootPath, (e) => {
                fs.writeFileSync(`${rootPath}/jquery.js`, body, 'utf-8')
                resolve()
            })
        })
    })
}

fs.mkdir('./external', (e) => {
    Promise.all(versions.map(Fetch)).then(() => {
        console.log('external scripts downloaded')
    })
})