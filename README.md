# Starter kit for Firebase / Typescript / Node / Koa

WORK IN PROGRESS

## Features

Fully configured to auto build and deploy.

- Firebase functions:
  - Typescript & TSLint,
  - Jest unit testing,
  - KoaJS example,
  - Koa CORS,
  - Middleware for response times and error handling.
- Realtime database - Sample rules, Bolt compiler and Typescript converter
- Firestore database - Sample rules
- Firebase Hosting
  - Rewrite /api => Firebase functions (currently Firebase has a problem here - yet to fix)
  - Rewrite SPA client side paths to index.html
  - Proxy and CDN caching rules for CSS and Images
- Deployment:
  - Configured to auto build and deploy your firebase services.

## Node 8

At time of writing, [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) and [Google Cloud Functions](https://cloud.google.com/functions/docs/) can run on Node v8, with Node 10 still in beta (node v6 has just been deprecated).

The current status of supported languages and versions are [listed here](https://cloud.google.com/functions/docs/concepts/exec).

Google has additional resources for setting up development for their Node v8 environment  ...

   - https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime

I'd particularly recommend using a Node Version Manager for your OS platform:
- [Mac/Linux](https://github.com/nvm-sh/nvm)
- [Windows](https://github.com/coreybutler/nvm-windows)

# INSTALL

## Clone this repo

      $ git clone https://github.com/tohagan/firebase-typescript-koa-starter.git

## Setup Firebase SDK and tools

- Ref: https://firebase.google.com/docs/functions/get-started

       $ npm install -g firebase-tools

## Initialise your project service files.

Sign in to [Firebase Console](https://console.firebase.google.com) and create yourself a new project and then select "Database" menu option and provision the database service that you wish to use ("Firestore" or "Realtime database" - labelled as "Database").

1. Login from the command line.

      $ firebase login

Normally you'd then initialise your new Firebase project ... with `firebase init` but please DON'T for this starter kit as it's already configured for you! For this starter kit, we've selected Firestore, Database, Functions, Hosting and Storage services.  Review all the service settings in `firebase.json` and remove those you don't need. You'll likely only want to use one of the databases in your final project.

2. Update `.firebasrc` with your Firebase Project ID  (replace `"typescript-koa-starter"`) to created in Firebase Console.

3. Install NPM dependencies.

      $ cd functions
      $ npm install
      $ cd ../hosting
      $ npm install
      $ cd ..

4. You're ready to auto build and deploy!

    $ firebase deploy

## Static file hosting

If you've been coding Node/Express apps a while, you might be considering hosting your static files as part of your Koa app, but I'd recommend you instead use the Firebase hosting service. Your static files will then be deployed on Google's global CDN service with automatic SSL enabled. Deployment is also super easy and fast and hosting will be cheaper.

For this starter kit we've also use `hosting/public` folder for our hosted static files. I like keep my client app source code under `public/src`and perform client builds under the `hosting` folder to void cluttering up the top level directory.

If you're creating web app for a [PWA](https://developers.google.com/web/progressive-web-apps/) or [SPA](https://en.wikipedia.org/wiki/Single-page_application) app for something like [Vue](http://vuejs.org), [React](https://reactjs.org/) or [Angular](https://angular.io/) then you might want to select the build output folder of your client-side framework in `firebase.json` in place of `hosting/publc`.

## Rewrite Rules

5. Some SPA frameworks offer the option to allow client-side routing URLs that use a standard `/` delimiter instead a `#` to delimit the client-side path but they need server-side support to do this. We've added this rewrite rule in `firebase.json` to ensure that these paths are re-written to `index.html`.  If you don't want this, you'll need to remove this rule.

6. In `firebase.json`, we also rewrite all calls to `/api` and `/langs` to matching sample Firebase Functions.

Currently there appears to be a bug in Firebase rewrite rules that fails to remove /api from the path that is sent to the Koa router.  Works fine if you're not using these rewrite rules.

# WHY?

## Why KOA? (instead of Express)

Now that Firebase Functions supports the Node v8 engine we can use native `async/await` and this opens the door to using Koa in place of Express to create our serverless Node apps.

Koa is a new web framework designed by the same team who created Express. It's designed to be smaller, more expressive, and more robust for both web applications and APIs. Koa replaces callback functions with `async` functions.

Koa also boasts a smarter middleware API that allow interception of both *incoming requests* (like Express) and *reply responses* (unlike Express) from later down the middleware pipeline. Our starter code sample will demonstrate how this allows simplifies error-handling.

## Why Typescript?

Adding Typescript ensures you get the best IDE support (smarter intellisense, code refactoring, references, linting) for tools like Visual Studio Code or Web Storm. Strong type checking  reduces your risk of critical server side bugs and security holes. Type checking adds constraints to the expected behaviour of your code so it's a bit like getting additional free unit tests.

The Typescript compiler cross compiles your code to a specific target version of JavaScript.   So if/when the need arises you can switch to an older or later version of Node / JavaScript. 

# Node 8 and KOA for Firebase Functions

Our next steps will ALL be in the `functions/` folder that we'll use to maintain Firebase Functions code.

    $ cd functions

## Update to Node 8 engine

Edit `package.json` and add the following at the top level:

```
  "engines": {
    "node": "8"
  },
```

Firebase deployment should detect this setting and select their Node 8 environment.

For a comprehensive check list of Node version features refer to https://node.green/

## Setup Typescript

We can install a global version of Typescript but I prefer to install it locally with the project so I know if I (or a team member) needs to pick up the project last we can be reassured we compiling with the same Typescript version.

Upgrade to the latest Typescript and TSLint ...

     $ npm install typescript --save-dev
     $ npm install tslint@latest --save-dev

Now to ensure we run the local Typescript ... edit `package.json` and replace

```
  "build": "tsc",
```

with

```
  "build": "./node_modules/.bin/tsc",
```

Since we're executing our code in Node 8, we can set the Typescript compiler target and libraries to use the ES2017 JavaScript supported by Node v8.

Edit the `tsconfig.json` file and add/update the following settings under `compilerOptions`:

Here's the complete `tsconfig.json` file ...  (remove the `<<` comments!).

```
{
  "compilerOptions": {
    "target": "es2017",         << Node 8 JavaScript
    "lib": ["es2017"],          << Node 8 JavaScript
    "module": "commonjs",
    "moduleResolution": "node", << Emulate Node module resolution
    "resolveJsonModule": true,  << can import .json files
    "esModuleInterop": true,    << Allow default imports from modules with no default export.
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "typeRoots": ["node_modules/@types"]  << In theory not needed
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

Add the latest Typescript type definitions for Node 8 libraries so your tools:

    $ npm install @types/node@8.x --save-dev

## Upgrade/Install firebase libs

    $ npm install firebase-functions@latest --save
    $ npm install firebase-admin@latest --save

AFAIK, Firebase does not yet supply Typescript definitions for these libraries.

## Test Typescript and Firebase deployment

    $ cd functions
    $ npm run build     -- Check that your Typescript compile is working

You can now recompile and deploy the sample HelloWorld serverless function that you'll find in `functions/src/index.ts`

    import * as functions from 'firebase-functions';

    export const helloWorld = functions.https.onRequest((request, response) => {
      response.send("Hello from Firebase!");
    });

Let's now compile and deploy it ...

    $ npm run deploy

The first time you deploy a serverless function, Firebase will display the URL to that function. You might want to bookmark this link!

For our starter demo it displays ...

      +  functions[helloWorld(us-central1)]: Successful create operation.
         Function URL (helloWorld): https://us-central1-typescript-koa-starter.cloudfunctions.net/helloWorld

So visiting `https://us-central1-typescript-koa-starter.cloudfunctions.net/helloWorld` should now display "Hello from firebase!".

# Migrate from Express to KOA

Firstly, let's install KOA and KOA Router with Typescript type definitions:

    $ npm install koa koa-router --save
    $ npm install @types/koa @types/koa-router --save-dev


Now (at last!) let's update `functions/src/index.ts` to use Koa ...

```
import * as functions from "firebase-functions";

import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

router.get("/hi", async (ctx, next) => {
  ctx.body = JSON.stringify({ hello: 'world' });
});

interface PostVersion {
  postId: number
}

router.get("/posts/{postId}/{version}", async (ctx, next) => {
  const store = new LessonStore();
  const req = ctx.params as LessonRequest;
  const lesson = store.getLesson(req);
  ctx.body = JSON.stringify(lesson);
});

app.use(router.routes());
app.use(router.allowedMethods());

// Secret sauce to make a Koa app a Firebase function:
export const api = functions.https.onRequest(app.callback() as any);

```

## Koa Error Handling

TBC

## What Now?

Core the KOA library excludes many of the common middleware APIs (like KOA Router) found in Express. This keeps the core library light and thin. Checkout [Awesome Koa](https://github.com/ellerbrock/awesome-koa) for a comprehensive and extensive list of Koa Examples & Tutorials, Middleware libraries and other resources!

Happy coding!

Tony.

## ACKOWLEDGEMENTS

- Folder structure and `/database` code sample from https://github.com/chetbox/place
