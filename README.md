# react-themer
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/shanedasilva/retheme.svg?branch=master)](https://travis-ci.org/shanedasilva/retheme)
[![codecov](https://codecov.io/gh/shanedasilva/retheme/branch/master/graph/badge.svg)](https://codecov.io/gh/shanedasilva/retheme)
[![dependencies](https://david-dm.org/shanedasilva/retheme.svg)](https://david-dm.org/shanedasilva/retheme)
[![devDependency Status](https://david-dm.org/shanedasilva/retheme/dev-status.svg)](https://david-dm.org/shanedasilva/retheme#info=devDependencies)
************************************************************


## Installation
```js
npm install react-themer --save
```
************************************************************

## Usage
### Basic Usage
#### Component Definition
```js
import React from 'react';
import themer from 'react-themer';
import theme from './styles.(css|scss|jss.js)';

const Header = (props) => {
  const { styles } = props.theme;

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{props.content}</h1>
    </div>
  );
};

export default themer(theme)(Header);
```

#### Component Usage
```js
import React from 'react';
import { render } from 'react-dom';
import Header from './Header';

render(<Header content="Some content here" />, document.getElementById('app'));
```

#### Adding Middleware
```js
import React from 'react';
import { render } from 'react-dom';
import themer from 'themer';
import Header from './Header';

// see `themer`(https://github.com/CAAPIM/themer) for how to set middlewares
themer.setMiddleware((component, resolvedTheme) => {
  // middleware code to execute...
  return component; // return component
});

render(<Header content="Some content here" />, document.getElementById('app'));
```


### Adding a Custom react-themer Instance
#### themer.js
```js
import { create as createThemer } from 'themer';
import { create as createReactThemer } from 'react-themer';

// create themer instance.
const themer = createThemer();

// Set middleware for the newly created instance
themer.setMiddleware((component, resolvedTheme) => {
  // middleware code to execute...
  return component; // return component
});

const reactThemer = createReactThemer(themer);

export default reactThemer;
```

#### Using Decorator in Component
```js
import React from 'react';
import themer from '../themer';
import theme from './styles.(css|scss|jss.js)';

const Header = (props) => {
  const { styles } = props.theme;

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{props.content}</h1>
    </div>
  );
};

export default themer(theme)(Header);
```
************************************************************

## Development
|`npm run <script>`|Description|
|------------------|-----------|
|`lint`| Runs eslint against all `.js` files in `./src` folder.|
|`test`|Runs [Mocha](https://github.com/mochajs/mocha) against all `./src/*.spec.js` files.|
|`test:watch`|Runs long running `test` command.|
|`test:coverage`|Runs `test` command and generates coverage report.|
|`precommit`|Runs `lint`, `test` commands.|
|`commit`|Uses [commitizen](https://github.com/commitizen/cz-cli) to do proper tagged commits.|
|`release`|Uses [semantic-release](https://github.com/semantic-release/semantic-release) to trigger releases.|
************************************************************

## How Can You Contribute
Your contributions are welcome and much appreciated. To learn more, see the [Contribution Guidelines](https://github.com/CAAPIM/react-themer/blob/master/.github/CONTRIBUTING.md).

This project supports `commitizen`. You can use `npm run commit` to run the local instance of `commitizen` or `git cz` if you have it installed globally.

Alternatively, if you are simply using `git commit`, you must follow this format:
`git commit -m "<type>: <subject>"`
************************************************************

## License
Copyright (c) 2016 CA. All rights reserved.
This software may be modified and distributed under the terms of the MIT license. To learn more, see the [License](https://github.com/CAAPIM/react-themer/blob/master/.github/LICENSE.md).
