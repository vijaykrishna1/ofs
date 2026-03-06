# OFS Plugin Debugging Script

This lightweight plugin script helps redirection to standard action screens inside Oracle Field Service. It supports basic message passing between an OFS parent window and your plugin—specifically for cases where you need to handle redirection using the `backScreen` parameter.

> **Not affiliated with Oracle. Use at your own discretion**
> **This is a basic script does NOT handle service workers.**

---

## How It Works

- Listens for messages from the parent (OFS) window.
- On "open," expects a parameter named `backScreen`.
- Redirects to the action screen specified by `backScreen`.
- If `backScreen` is missing, it will alert the user.
- For the full, up-to-date list of valid `backScreen` values, see the OFS documentation:  
  https://docs.oracle.com/en/cloud/saas/field-service/fapcf/c-redirectionwithclosemethod.html

---

## Files

- `plugin.js` – Handles incoming messages and manages redirection.
- `index.html` – Minimal page acting as the plugin container.

---

## Installation

1. Zip the index.html and plugin.js file
2. Create a new plugin in OFS/FFS and upload the zip file
3. Add a button in screen and link to plugin. Make sure to add parameter "backScreen" with values from the OFS documentation.

