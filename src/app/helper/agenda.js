const Agenda = require("agenda");
const Ping = require("./ping");
const Check = require("../models/check");
const CheckAudit = require("../models/checkAudit");
const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } });

/**
 * @desc     AGENDA functionalty
 */

const create = async (check) => {
  let checkFullUrl = check.protocol.toLowerCase() + "://" + check.url + check.path
  if (check.port) 
      checkFullUrl=check.protocol.toLowerCase() + "://" + check.url+":"+check.port.toString() + check.path
  
  
  console.log(checkFullUrl);
  await agenda.define(check._id.toString(), async (job) => {
    const result = await Ping.test(
      agenda,
      check._id,
      checkFullUrl,
      check
    );
    result.checkId = check._id;
    result.url = checkFullUrl;
    result.interval = check.interval;
    await CheckAudit.create(result);
  });
  // await agenda.every("*/15 * * * * *", check._id.toString());
  await agenda.every(check.interval + " minutes", check._id.toString());
};

const startUp = async () => {
  const checks = await Check.find();

  checks.map(async (check) => {
    if (!check.isPaused) {
      await create(check);
    }
  });
  await agenda.start();
};

const canaleJop = async (id) => {
  await agenda.cancel({ name: id.toString() });
};

module.exports = { startUp, create, canaleJop };
