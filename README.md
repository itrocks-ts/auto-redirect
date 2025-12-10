[![npm version](https://img.shields.io/npm/v/@itrocks/auto-redirect?logo=npm)](https://www.npmjs.org/package/@itrocks/auto-redirect)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/auto-redirect)](https://www.npmjs.org/package/@itrocks/auto-redirect)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/auto-redirect?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/auto-redirect)
[![issues](https://img.shields.io/github/issues/itrocks-ts/auto-redirect)](https://github.com/itrocks-ts/auto-redirect/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# auto-redirect

Automatically triggers a redirect by simulating a click on a DOM link.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm install @itrocks/auto-redirect
```

This package is usually pulled as a dependency of other `@itrocks` front-end modules
(`@itrocks/framework`, `@itrocks/delete`, `@itrocks/save`, `@itrocks/user`, …), but
it can also be used on its own in any browser application.

To enable the automatic behavior, make sure that both the script and the stylesheet
are loaded in the page:

```html
<link href="./node_modules/@itrocks/auto-redirect/auto-redirect.css" rel="stylesheet">
<script src="./node_modules/@itrocks/auto-redirect/build.js" type="module"></script>
```

Adjust the paths according to your bundling / deployment setup.

## Usage

### Minimal example

Once the stylesheet and the script are loaded, any anchor matching the selector
`a.auto-redirect` is turned into an automatic redirect:

```html
<link href="/assets/auto-redirect.css" rel="stylesheet">
<script src="/assets/auto-redirect/build.js" type="module"></script>

<a class="auto-redirect" href="/home" target="_self">Continue</a>
```

When the page is displayed, a click is programmatically triggered on the link,
which immediately sends the browser to `/home`. The user does **not** have to
click the link.

### Example with targets and application routes

This package is typically used together with the `@itrocks/framework` routing
scheme. Below is an example close to how it is used in other `@itrocks` modules
such as `@itrocks/save`, `@itrocks/delete`, `@itrocks/user` or `@itrocks/forgot-password`:

```html
<link href="../../auto-redirect/auto-redirect.css" rel="stylesheet">
<script src="../../auto-redirect/build.js" type="module"></script>

<!--
  Redirect the user back to the list view of the current type once the
  current action (save / delete / etc.) has completed.
-->
<a class="auto-redirect" href="app://(type.@route)/list" target="main">Back to list</a>
```

In this example:

- The `href` uses the `app://` scheme and placeholders understood by
  `@itrocks/framework`.
- The `target` attribute is set to `main` so the redirect happens in a specific
  frame or window.
- The `class="auto-redirect"` is the only thing required by this package:
  anchors without this class are left untouched.

## API

The package exposes a very small programmatic API, and is mainly designed to be
used declaratively via HTML.

### HTML / CSS contract

- **Selector**: `a.auto-redirect`
  - Any anchor element with the `auto-redirect` CSS class will be enhanced.
  - The enhancement consists in scheduling a programmatic click on the element
    once the page is ready.
- **CSS**: the `auto-redirect.css` file only contains minimal styling for the
  anchor. You can override these styles in your own stylesheet if needed.

### JavaScript module

#### `autoRedirect(element: HTMLAnchorElement): void`

Programmatically enables the automatic redirect behavior on a given anchor.

Parameters:

- `element`: the `HTMLAnchorElement` that should be clicked automatically.

Behavior:

1. A temporary `click` event listener is attached to the element in order to
   stop the event propagation when the automatic click is fired.
2. A microtask is scheduled with `setTimeout` (without delay) that:
   - calls `element.click()` to trigger the navigation,
   - then removes the temporary `click` listener.

Return value:

- `void` – the function is used only for its side effects.

While you usually rely on the automatic wiring done by `build.js`, you can also
import and call `autoRedirect` yourself in a custom script:

```ts
import { autoRedirect } from '@itrocks/auto-redirect'

const anchor = document.querySelector<HTMLAnchorElement>('a.auto-redirect')
if (anchor) {
  autoRedirect(anchor)
}
```

### `build.js` integration

The `build.js` file integrates with the optional `@itrocks/build` helper. It
registers a behavior that automatically calls `autoRedirect` on every
`<a class="auto-redirect">` found in the document.

In most setups you only have to load `build.js` once; it will take care of
enhancing every matching anchor.

## Typical use cases

- **Post-action redirects**
  - After a user saves a form, show a confirmation screen with an
    `auto-redirect` link that automatically sends them back to the list or
    detail view.

- **Account flows**
  - After signup or password reset, display a short confirmation page that
    automatically redirects to the login screen:

    ```html
    <a class="auto-redirect" href="app://(@route)/login" target="main">
      Connect user
    </a>
    ```

- **Authenticated entry point**
  - When a user has just authenticated, use an `auto-redirect` link to send
    them to their original destination stored in an application-specific
    `redirect` value:

    ```html
    <a class="auto-redirect" href="app://(redirect)">Continue</a>
    ```

- **Kiosk / flow-based applications**
  - In applications where each screen leads automatically to the next one
    (for example, multi-step wizards or kiosks), use `auto-redirect` links to
    move the user to the next step without requiring an explicit click.
