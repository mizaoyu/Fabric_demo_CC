This sub-project was bootstrapped with [React](https://github.com/facebookincubator/create-react-app).

### Folder Structure

After `npm install`, your project should look like this:

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

Inside `src`, these are files for pages. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and CSS files inside `src`**, or Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br>

File `package.json` is used for `npm` to install the dependency modules, which will be in folder `node_modules` after `npm install`. If you want to use some additional external libraries, you can `cd` into the project folder and do `npm intall {library name on npm} --save `. This will add the new dependency line automatically into the `package.json`.

Under the `src` folder, `index.js` is the root JS the project calls. Any second-level components should be mentioned in it. For example, in this project, `App.js` and `Menu.js` are the two children component of it, which represents the login page and function menu page respectively.

For other JS files, they each indicate a component or provide some functions. 
* common.js - provides some common functions that will be used by multiple components. Currently mainly for handling http response.
* enroll.js - the login module, children of App.js 
* registerServiceWorker.js - lets the app load faster on subsequent visits in production, don't need to modify.

* .... The rest .js files are self-explanatory by their name. They are all children of Menu.js, each for a function. Such as
* CreateChannel.js - create channel module, children of Menu.js
* InstallChaincode.js - install chaincode module, children of Menu.js ...

