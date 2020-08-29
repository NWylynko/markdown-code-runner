typescript

``` ts
const hey = (person: String) => {
  return 'Hello, ' + person;
}

console.log(hey("nick"));
```

``` markdown-code-runner output
npm WARN lifecycle The node binary used for scripts is /var/folders/dc/__zbnbsn19x35gh1dqyv4wmr0000gn/T/yarn--1598717949047-0.7554773616132884/node but npm is using /Users/nick/.nvm/versions/node/v14.5.0/bin/node itself. Use the `--scripts-prepend-node-path` option to include the path for the node binary npm was executed with.

> 89077908@1.0.0 start /private/tmp/89077908
> ts-node index.ts

Hello, nick
```
