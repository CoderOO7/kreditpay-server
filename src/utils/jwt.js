const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Middleware to validate token
   */
  validateToken: (req, res, next) => {
    let result = {};
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(" ")[1];
      const options = {
        expiresIn: "2d",
      };
      try {
        // return decoded token
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        // pass execution to subsequent middleware
        next();
      } catch (err) {
        throw new Error(err);
      }
    } else {
      result = {
        error: `Authentication Error. Token required.`,
        status: 401,
      };
      res.status(401).send(result);
    }
  },
};
