const db = require('../../data/db-config.js');

const getAll = () => {
  //return db.select().table('accounts');
  return db('accounts');
}

const getById = id => {
  return db('accounts').where('id', id).first();
}

const create = async account => {
  const value = await db('accounts').insert(account);
  return getById(value);
}

const updateById = async (id, account) => {
  await db('accounts').where('id', id).update(account);
  return getById(id);
}

const deleteById = async id => {
  const deleted = await getById(id);
  await db('accounts').where({ id }).del()
  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
