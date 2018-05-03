const http = require('http')
const app = require('./app')

const port = process.env.PORT || 5000
const server = http.createServer(app)

// Start listening
server.listen(port)
console.log('API server started on port ' + port)

// vi: sw=2
