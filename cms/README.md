# Hypercontent Layer
This nuxt layer aims to be used with a new Nuxt app.
It will supercharge it into a hybrid statically generated
wesbite based on nuxt content v2.

Why hybrid? Because it allows you to define which part of your
site should be static and which should remain dynamic. The
dynamic part is supported by a pocketbase database.

## Setup
1. Create a normal nuxt app next to the `hypercontent` directory
   using the standard nuxi command.
   `npx nuxi@latest init <project-name>`
2. Register hypercontent into your project. The hypercontent
   directory should be in the same directory as your project.
   Update your `nuxt.config.ts` to something like the following.

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    '../hypercontent/cms'
  ],

  devtools: { enabled: true },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2024-10-27',
  hypercontent: {
    copyFiles: {
      enabled: true,
      dest: __dirname
    },
    setConfigs: {
      enabled: true
    }
  }
})
```
3. Run `npm run prepare`

You'll notice that a couple of files were added to your project.
That's due to the `copyFiles` command of hypercontent. Your
project now has a pocketbase database and a task runner.
On top of that, the installer also updated your package.json
with some commands and new useful dependencies.

4. Run again `npm i` to install the new dependencies.
5. Run `bin/task bootstrap` (if it doesn't work, ensure that
   the `task` file in bin directory is executable).

Now your database is bootstrapped with a couple of data and 
can be reached in the browser (check the console for the URL).

# Nuxt Layer Starter

Create Nuxt extendable layer with this GitHub template.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Working on your theme

Your theme is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on NPM.

The `.playground` directory should help you on trying your theme during development.

Running `pnpm dev` will prepare and boot `.playground` directory, which imports your theme itself.

## Distributing your theme

Your Nuxt layer is shaped exactly the same as any other Nuxt project, except you can publish it on NPM.

To do so, you only have to check if `files` in `package.json` are valid, then run:

```bash
npm publish --access public
```

Once done, your users will only have to run:

```bash
npm install --save your-theme
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'your-theme'
})
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Or statically generate it with:

```bash
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment) for more information.
