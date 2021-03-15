const router = require('express').Router()
const Accounts = require('./accounts-model');
const { checkAccountId, checkAccountNameUnique, checkAccountPayload } = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.json(accounts);
  } catch(err) { next(err) }
})

router.get('/:id', checkAccountId, (req, res, next) => {
  res.json(req.verifiedId);
  next();
})

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = await Accounts.create(req.body)
    res.status(201).json(newAccount);
  } catch(err) { next(err) }

})

router.put('/:id', checkAccountId, checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const updatedAccount = await Accounts.updateById(req.params.id, req.body)
    res.json(updatedAccount);
  } catch(err) { next(err) }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const delAccount = await Accounts.deleteById(req.params.id);
    res.json(delAccount);
  } catch(err) { next(err) }
})

router.use((err, req, res, next) => { // eslint-disable-line
  // CALL next(err) IF THE PROMISE REJECTS INSIDE YOUR ENDPOINTS
  res.status(500).json({
    message: 'something went wrong inside the accounts router',
    errMessage: err.message,
  })
})

module.exports = router;
