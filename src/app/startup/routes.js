module.exports = (app) => {
  // Routes
  app.use("/api/v1/user",require("../routes/user"));
  app.get("/", (req, res) => {
    res.status(200).send(" Bosta Uptime Monitoring RESTful API Server is Running....");
  });
};
