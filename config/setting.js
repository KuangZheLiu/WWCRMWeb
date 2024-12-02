module.exports = {
  HTTPServer: {
    viewsRoot: '../views',
    httpPort: 80,
    timeout: 30000,
  },
  BUILD_MODE: 'PRODCUTION', // DEBUG, VERBOSE, PRODCUTION
  LOG_PATH: '/data/log/debug.log',
  mssql: {
    CRM: {
      user: 'root',
      password: 'root',
      //"server": "localhost\\SQLEXPRESS",
      server: '127.0.0.1',
      port: 1433,
      database: 'WWCRM',
      options: {
        trustServerCertificate: true,
        requestTimeout: 5 * 60 * 1000,
        // encrypt: true, // Use this if you're on Windows Azure
      },
    },
  },
}
