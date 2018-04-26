module.exports = {
  port: 3000,
  tradier: {
    hostname: "sandbox.tradier.com"
  },
  db: {
    dev: {
      host: 'localhost',
      port: 27017,
      name: 'oitracker'
    },
    production: {
      host: 'localhost',
      port: 27017,
      name: 'oitracker'
    }
  }
};
