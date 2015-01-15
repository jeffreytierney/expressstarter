// TODO: move all tables and getTableName method to one file
var tables = {
  users: 'users'
};

function getTableName(key, params) {
  params = params || {};
  if(typeof params === "string") { params = {user_id:params}; } // allow just passing of user_id
  var name = tables[key];
  return name;
}

module.exports = {
  getTableName: getTableName
};
