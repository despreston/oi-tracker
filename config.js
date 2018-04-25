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
      host: ''
      port: 27017,
      name: 'oitracker',
      username: 'production',
      password: 'i8EwXyTYb6dYJPZ3'
    }
  }
};
