const Westend = require(`../mods/westend/westend.js`);
const Kusama = require(`../mods/kusama/kusama.js`);
const Polkadot = require(`../mods/polkadot/polkadot.js`);

let app = {};
    app.modules = {};
    app.modules.mods = [];
    app.modules.mods['WND'] = new Westend(app);
    app.modules.mods['KSM'] = new Kusama(app);
    app.modules.mods['DOT'] = new Polkadot(app);

console.log("Run a series of tests...");

console.log(app.modules.mods['WND'].subscanEndpoint);

