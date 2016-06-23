[![Circle CI](https://circleci.com/gh/rangle/angular2-chat.svg?style=svg)](https://circleci.com/gh/rangle/angular2-chat)

# Angular 2 real-time messaging application example

This is an example of an Angular 2 application using Redux and TypeScript.
It is a real-time communication application that uses socket.io. To try,
open several different web browsers (not the same browser instance! Use
Chrome Canary and Chrome simultaneously, for example), log in, add a contact,
and start messaging.

Note that this was put together in a very short period, 2 days, and there
are likely many oversights and things that are not fully fleshed out. (For
example, contact presence is not fully baked). But as an example application,
it serves its purpose.

## Getting Started

## npm scripts

> To see all available scripts:
```bash
$ npm run
```

### Dev
```bash
$ npm run dev
```
This runs a development mode server with live reload etc. Linter warnings will be displayed with each reload.

Open `http://localhost:8080` in your browser.

### Production

```bash
$ npm install
$ npm start
```

This runs a production-ready express server that serves up a bundled and
minified version of the client.

Open `http://localhost:8080` in your browser.

### Tests

#### Single Run (with linting and coverage)
```bash
$ npm test
# or
$ npm t
```

#### Watch Files
```bash
$ npm run test:watch
```

#### Linting
```bash
$ npm run lint
```
This will run both code and style linters, but you can run them individually using `npm run lint-ts` and `npm run lint-css`.

#### Coverage
```bash
$ npm run cover
```

## If something doesn't work

Submit a PR! We would love to have your fix.

## Example Application

TBC

## License

Copyright (c) 2016 rangle.io

[MIT License][MIT]

[MIT]: ./LICENSE "Mit License"
