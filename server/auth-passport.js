'use strict';

function generateToken(users) {
  let token;
  do {
    token = (new Date().valueOf() + Math.random()).toString(16);
  } while (users.hasOwnProperty(token));

  return token;
}

module.exports = {
  authenticateUser: (name, username, password, users) => {
    return new Promise(resolve => {
      if (users.hasOwnProperty(username)) {
        resolve(users[username]);
      }

      const token = generateToken(users);

      const result = { id: username, name, username, token };

      users[username] = result;

      resolve(result);
    });
  },

  getUserById: (id, users) => {
    if (users.hasOwnProperty(id)) {
      return users[id];
    }

    return {};
  },
};
