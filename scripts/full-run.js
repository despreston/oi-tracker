/**
 * Starts the server on the main process and forks the `fetch-cron-agent`
 * script.
 */
const { fork } = require('child_process');
const server = require('../index');

const cronJob = fork( `${__dirname}/fetch-cron-agent.js` );
