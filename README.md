# Starter kit for Firebase Functions / Typescript / KoaJS

- [Koa JS](https://koajs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) 

## Features

Fully configured to auto build and deploy each Firebase service.

- [Firebase Cloud functions](https://firebase.google.com/docs/functions):
  - Typescript & TSLint,
  - Jest unit testing,
  - KoaJS example,
  - Koa CORS,
  - Middleware for response times and error handling.
- [Realtime database](https://firebase.google.com/docs/database) - Sample rules, Bolt compiler and Typescript converter
- [Firestore database](https://firebase.google.com/docs/firestore) - Sample rules
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
  - Rewrite /api => Firebase functions (currently Firebase has a problem here - yet to fix)
  - Rewrite SPA client side paths to index.html
  - Proxy and CDN caching rules for CSS and Images
- [Firebase Storage](https://firebase.google.com/docs/storage) - rule sample.

## Node 8

At time of writing, [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) and [Google Cloud Functions](https://cloud.google.com/functions/docs/) can run on Node v8, with Node 10 still in beta (node v6 has just been deprecated).

The current status of supported languages and versions are [listed here](https://cloud.google.com/functions/docs/concepts/exec).

Google has additional resources for setting up development for their Node v8 environment  ...
I test locally with the same Node version used by Firebase (currrent 8.15.0). 
Check their current version here:

   - https://cloud.google.com/functions/docs/concepts/nodejs-8-runtime

I'd recommend using a Node Version Manager for your OS platform:
- [Mac/Linux](https://github.com/nvm-sh/nvm)
- [Windows](https://github.com/coreybutler/nvm-windows)

## INSTALL

## Clone this repo

     $ git clone https://github.com/tohagan/firebase-typescript-koa-starter.git

## Setup Firebase SDK and tools

- See https://firebase.google.com/docs/functions/get-started

      $ npm install -g firebase-tools

## Initialise your project service files.

Sign in to [Firebase Console](https://console.firebase.google.com) and create yourself a new project and then select "Database" menu option and provision the database service(s) that you wish to use ("Firestore" or "Realtime database" - labelled as "Database").

1. Login from the command line

       $ firebase login

Normally you'd then initialise your new Firebase project with `firebase init` but DON'T do this as you'd overwrite the `firebase.json` file! For this starter kit, we've selected Database, Firestore, Functions, Hosting and Storage services. We've not included the new Google Run service. 

Review all the service settings in `firebase.json` and remove those you don't need (normally `firebase init` would prompt you for these). You'll likely only want to use one of the databases in your final project. It's OK to use both.  

2. Update `.firebasrc`, replacing `"typescript-koa-starter"` as default project with the Project ID you created in Firebase Console.

3. Install NPM dependencies for `functions` and `hosting` services.

       $ cd functions
       $ npm install
       $ cd ../hosting
       $ npm install
       $ cd ..

4. You're now ready to auto build and deploy!

       $ firebase deploy

## Hosting

For this starter kit we've also use `hosting/public` folder for our hosted static files. I like keep my client app source code under `public/src`and perform client builds under the `hosting` folder to void cluttering up the top level directory.

If you've been coding Node/Express apps a while, you might be considering hosting your static files as part of your Koa app, but I'd recommend you instead use the Firebase hosting service. Your static files will then be deployed on Google's global CDN service and have  SSL automatically enabled. Deployment is also super easy and fast (only uploads changed files) and hosting will be cheaper.  

If you're creating web app for a [PWA](https://developers.google.com/web/progressive-web-apps/) or [SPA](https://en.wikipedia.org/wiki/Single-page_application) app for something like [Vue](http://vuejs.org), [React](https://reactjs.org/) or [Angular](https://angular.io/) or [Ionic](https://ionicframework.com/) then you might want to select the build output folder of your client-side framework in `firebase.json` in place of `hosting/publc`.

## Rewrite Rules

5. Some WPA/SPA frameworks offer the option to allow client-side routing URLs that use a standard `/` delimiter instead a `#` to delimit the client-side path but they need server-side support to do this. We've added this rewrite rule in `firebase.json` to ensure that these paths are re-written to `index.html`.  If you don't want this, you'll need to remove this rule.

6. In `firebase.json`, we also rewrite all calls to `/api` and `/langs` to matching sample Firebase Functions.

Currently there appears to be a bug in Firebase rewrite rules that fails to remove /api from the path that is sent to the Koa router.  Works fine if you're not using these rewrite rules.

## What Now?

Core the KOA library excludes many of the common middleware APIs (like KOA Router) found in Express. This keeps the core library light and thin. Checkout [Awesome Koa](https://github.com/ellerbrock/awesome-koa) for a comprehensive list of Koa Examples & Tutorials, Middleware libraries and other resources!

Happy coding!

Tony.

## ACKOWLEDGEMENTS

- Folder structure and `/database` code sample is from https://github.com/chetbox/place
