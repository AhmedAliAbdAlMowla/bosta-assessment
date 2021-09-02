module.exports = (app) => {
  // Routes
 
  app.get("/", (req, res) => {
    res.status(200).send(" Bosta Uptime Monitoring RESTful API Server is Running....");
  });
};
