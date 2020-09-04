# markdown-code-runner
github action to run code in a markdown file and append the output to the markdown file

Javascript

``` js
console.log('hello world from javascript')
```


``` markdown-code-runner
hello world from javascript

```


Typescript

``` ts
console.log('hello world from typescript')
```


``` markdown-code-runner
hello world from typescript

```


JSX

``` jsx
import React from "react"

const App = () => <p>hello world from jsx</p>

export default App
```

<!-- markdown-code-runner image-start -->

![rendered jsx](./README.2.png)

<!-- markdown-code-runner image-end -->

Python 2

``` py
print 'hello world from python 2'
```


``` markdown-code-runner
hello world from python

```

Python 3

``` py3
print('hello world from python 3')
```


Bash

``` bash
echo 'hello world from bash'
```


``` markdown-code-runner
hello world from bash

```


Shell

``` sh
echo 'hello world from Shell'
```


``` markdown-code-runner
hello world from Shell

```
