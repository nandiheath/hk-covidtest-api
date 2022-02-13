#!/bin/node

const fs = require('fs');
const moment = require('moment-timezone');
const { exec } = require("child_process");

const main = async () => {
    const now = moment().tz("Asia/Hong_Kong");
    files = fs.readdirSync(".");
    const runtimes = files.filter(
        file => {
            const s = fs.statSync(file);
            return s.isDirectory() && file.match(/\d{4}-\d{2}-\d{2}/);
        }
    ).filter(date => {
        return now.diff(moment.tz(date, "Asia/Hong_Kong"), 'days') >= 1;
    }).map(file => {
        return new Promise((resolve, reject) => {
            exec(`tar -zcf archive/${file}.gz ${file}`, (error, stdout, stderr) => {
                if (stderr) {
                    console.error(`unable to create gzip for ${file}: error: ${stderr}`);
                    reject(stderr);
                }
                fs.rmSync(file, { recursive: true, force: true });
                resolve();
            });
        })
    });

    await Promise.all(runtimes);
}

main().then().catch(err => {
    console.error(err);
})
