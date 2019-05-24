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

## INSTALL

## Clone this repo

      $ git clone https://github.com/tohagan/firebase-typescript-koa-starter.git

## Setup Firebase SDK and tools

- Ref: https://firebase.google.com/docs/functions/get-started

       $ npm install -g firebase-tools

## Initialise your project service files.

Sign in to [Firebase Console](https://console.firebase.google.com) and create yourself a new project and then select "Database" menu option and provision the database service that you wish to use ("Firestore" or "Realtime database" - labelled as "Database").

1. Login from the command line.

      $ firebase login

Normally you'd then initialise your new Firebase project ... with `firebase init` but DON'T do this for this starter kit as you'd overwrite the `firebase.json` file needed by this kit! For this starter kit, we've selected Firestore, Database, Functions, Hosting and Storage services.  Review all the service settings in `firebase.json` and remove those you don't need (normally `firebase init` would prompt you for these). You'll likely only want to use one of the databases in your final project. It's OK to use both.

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

## What Now?

Core the KOA library excludes many of the common middleware APIs (like KOA Router) found in Express. This keeps the core library light and thin. Checkout [Awesome Koa](https://github.com/ellerbrock/awesome-koa) for a comprehensive and extensive list of Koa Examples & Tutorials, Middleware libraries and other resources!

Happy coding!

Tony.

## ACKOWLEDGEMENTS

- Folder structure and `/database` code sample from https://github.com/chetbox/place
