module.exports = (app) => {
  // Routes
  app.use("/api/v1/user",require("../routes/user"));
  app.use("/api/v1/check",require("../routes/check"));
  app.get("/", (req, res) => {
    res.status(200).send(" Bosta Uptime Monitoring RESTful API Server is Running....");
  });
};
