const Accounts = require('./accounts-model');

const logger  = (req, res, next) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeStamp = new Date().toLocaleTimeString('en-US', options);

  console.log(`Request Method: ${req.method}`)
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Timestamp: ${timeStamp}`);
  next();
}

const checkAccountPayload = (req, res, next) => {
  const name = req.body.name;
  const budget = req.body.budget;
  if(!name || !budget) {
    res.status(400).json({ message: "name and budget are required" })
  } else if (typeof name !== 'string') {
    res.status(400).json({ message: "name of account must be a string" })
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" })
  } else if (typeof budget !== 'number') {
    res.status(400).json({ message: "budget of account must be a number" })
  } else if (parseInt(budget) <= 0 || parseInt(budget) > 1000000 ) {
    res.status(400).json({ message: "budget of account is too large or too small" })
  } else {
    next();
  }
}

const checkAccountNameUnique = async (req, res, next) => {
  try {
    const allAccounts = await Accounts.getAll();
    const nameMatch = allAccounts.filter(account => account.name === req.body.name)
    if (nameMatch.length > 0) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next()
    }
  } catch(err) { next(err) }
}

const checkAccountId = async (req, res, next) => {
  try {
    const verifiedId = await Accounts.getById(req.params.id);
    if(!verifiedId) {
      res.status(404).json({ message: "account not found" })
    } else {
      req.verifiedId =  verifiedId;
      next();
    }
  } catch(err) { next(err) }
}

module.exports = {
  logger,
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId
}
