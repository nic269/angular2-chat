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
      } else {
        const token = generateToken(users);

        // NOTE(cbond): If the user has just logged in, they must be online
        const presence = 'Online';

        const result = {
          id: username,
          name,
          presence,
          username,
          token,
          contacts: [],
          messages: [],
        };

        users[username] = result;

        resolve(result);
      }
    });
  },

  getUserById: (id, users) => {
    if (users.hasOwnProperty(id)) {
      return users[id];
    }

    return {};
  },
};
