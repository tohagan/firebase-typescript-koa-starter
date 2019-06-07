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

## Firebase Functions with Koa

To call a simple Firebase Cloud Function *without KoaJS* you'd register it as an export like so ...

```
export const langs = functions.https.onRequest((req: any, res: any) => {
  result = { ... }   // Compute response object
  res.send(result);  // Send response
});
```
... you can now call it using `/lang` path such as ...

- https://us-central1-typescript-koa-starter.cloudfunctions.net/langs

To use the routes and functions inside your KoaJS app you need to convert your Koa App into an Express compatible function with a `(req: any, res: any)` signature.
We can use Koa's `app.callback()` method to do this.

```
export const api = functions.https.onRequest(app.callback() as any);
```

You can now call all the routes inside this app via `/api/<path>`. When you do, the router inside won't see the `/api` in the path.
Although the method signature matches, the Request and Response types defined in KoaJS typescript don't match
those defined by Firebase functions API so we map the function returned by `app.callback()` as an `any` type to disable type checking.

For our code example you'd invoke this URL:
- https://us-central1-typescript-koa-starter.cloudfunctions.net/api/langs

`functions.https.onRequest()` method will invoke the callback method, passing a `req.url` value of `/lang`.
Firebase functions has removed the `/api` prefix and passes in the remaining path to our internal KoaJS router.
So KoaJS only need to register routes as `/lang` .. not `/api/lang`.

You'll find an example in `api.js` ...

```
router.get('/langs', async (ctx) => {
  result = { ... }    // Compute response object
  ctx.body = result;  // Send response
});
```
## Firebase Hosting

Firebase supports hosting static files such as our Web to PWA app that can call our Cloud Functions.
This hosting service can be configured via the `firebase.json` file with additional features including URL rewrite rules.

In our example you can view the web hosted `hosting/public/index.html` file at

- https://typescript-koa-starter.firebaseapp.com/

## Rewrite rules for Cloud Functions

In order to invoke a REST API at different domain name we'd normally need to configure a CORS rule in our Koa router to permit access to our API from the `typescript-koa-starter.firebaseapp.com` domain name to API on our cloud function domain hosted at `us-central1-typescript-koa-starter.cloudfunctions.net`.

CORS rules can be quite complex to configure correctly so many developers just allow open access to the REST APIs from any domain
as this is the simplest to configure, however this is not security best practice.

A simpler and more secure alternative is to host your web app and REST APIs on the **same hosting domain** and thus avoid coding CORS rules altogether!

The Firebase hosting proxy service allows us to appear to do this via a hosting rewrite rule that maps specific paths from the hosting domain to our cloud functions.
This rewrite rule maps all paths that match `/api/**` to our `api` cloud function.

```
  {
    "source": "/api/**",
    "function": "api"
  }
```

NOTE: Currently Firebase has a quirk (bug?) that means these rewrite rules fail to remove the `/api` prefix from the `req.url` path that is forwarded to our Koa router.
So in this example code, we've added a Middleware.fbRewriteFix() that updates the `req.url` path before its used by the KoaJS router.
This ensures that the routing still works the same when invoked by hosting rewrite or directly via `us-central1-typescript-koa-starter.cloudfunctions.net` domain.

I've submitted a request to Firebase engineers who are considering a change to fix this issue.

## PWA/SPA rewrite rule for index.html

Some PWA/SPA JavaScript frameworks like Vue, React and Angular offer the option to allow client-side routing URLs that use a standard `/` delimiter in place of a `#` to delimit their client-side path. This allows uses to navigate back and forward between pages in the same experience as other server side rendered web apps. To do this they need server-side support that to ensure that all URL paths are re-written to invoke `index.html`.  Our last rule performs this rewrite.

```
  {
    "source": "**",
    "destination": "/index.html"
  }
```
## What Now?

The core KOA library excludes many of the common middleware APIs (like KOA Router) found in Express. This keeps the core library light and thin. Checkout [Awesome Koa](https://github.com/ellerbrock/awesome-koa) for a comprehensive list of Koa Examples & Tutorials, Middleware libraries and other resources!

Happy coding!

Tony.

## ACKOWLEDGEMENTS & References

- Folder structure and `/database` code sample is from https://github.com/chetbox/place
- [Organizing your Firebase Cloud Functions](https://codeburst.io/organizing-your-firebase-cloud-functions-67dc17b3b0da)
