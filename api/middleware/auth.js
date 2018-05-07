const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1]
    req.payload = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY)
    next()
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed"
    })
  }
}
