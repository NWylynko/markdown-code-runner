## javascript

``` js
console.log("the javascript code is run in node");
console.log("it can do maths");
console.log(7 * 30 * Math.random() * 100);
console.log("and can render a table");
const score = () => Math.floor(Math.random() * 10);
const table = [
  { name: "chips", yummy: score() },
  { name: "pizza", yummy: score() },
  { name: "burger", yummy: score() },
];
console.table(table);
```

``` markdown-code-runner output
the javascript code is run in node
it can do maths
9023.175414555708
and can render a table
┌─────────┬──────────┬───────┐
│ (index) │   name   │ yummy │
├─────────┼──────────┼───────┤
│    0    │ 'chips'  │   0   │
│    1    │ 'pizza'  │   0   │
│    2    │ 'burger' │   6   │
└─────────┴──────────┴───────┘
```

``` js
const fetch = require("node-fetch");

console.log('Kanye West quote:')

fetch('https://api.kanye.rest/')
  .then(res => res.json())
  .then(body => body.quote)
  .then(console.log)
  .catch(console.error)
```

``` markdown-code-runner output
internal/modules/cjs/loader.js:968
  throw err;
  ^

Error: Cannot find module 'node-fetch'
Require stack:
- /tmp/9880727/index.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:965:15)
    at Function.Module._load (internal/modules/cjs/loader.js:841:27)
    at Module.require (internal/modules/cjs/loader.js:1025:19)
    at require (internal/modules/cjs/helpers.js:72:18)
    at Object.<anonymous> (/tmp/9880727/index.js:1:15)
    at Module._compile (internal/modules/cjs/loader.js:1137:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)
    at Module.load (internal/modules/cjs/loader.js:985:32)
    at Function.Module._load (internal/modules/cjs/loader.js:878:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/tmp/9880727/index.js' ]
}
```

<!-- markdown-code-runner
  {
    "dependencies": [
      "node-fetch"
    ]
  }
-->
<<<<<<< HEAD
=======
>>>>>>> eb94de8582b6ca355fefe7ec0c3793c54f79fbe3
