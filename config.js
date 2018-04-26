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
    docker: {
      host: 'db',
      port: 27017,
      name: 'oitracker'
    }
  }
};
