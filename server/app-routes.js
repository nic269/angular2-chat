module.exports = function (app, users) {
  app.post('/api/contacts/add', (req, response) => {
    const contacts = req.body;

    contacts.forEach(c => console.log('adding', c));

    response.send(true);
  });

  app.get('/api/contacts/list', (req, response) => {
    const list = Object.keys(users).map( // remove security token
      key => Object.assign({}, users[key], {token: undefined}));

    response.send(list);
  });
};
