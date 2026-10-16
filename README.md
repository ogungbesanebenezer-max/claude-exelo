# Exelo Agent Kit

A runnable React/Vite implementation of an Exelo-style AI receptionist operating-system landing page, packaged with the specifications and agent instructions needed to extend it with Claude Code, Codex, Cursor, or another coding agent.

## Run locally

```bash
npm install
npm run validate
npm run dev
```

Open the local Vite URL shown in the terminal. To create a production build, run `npm run build`.

## Included functionality

The app includes a responsive sticky header and mobile menu, a phone-call hero scene, portal dashboard mockup, six-step workflow navigator, infrastructure cards, live profit calculator, system flow, pricing plan tabs, monthly/annual billing toggle, comparison section, FAQ accordion, closing CTA, and responsive footer.

## Repository map

`src/main.jsx` contains the working React implementation. `src/styles.css` contains the responsive design system. `spec/` contains the product, UI, and acceptance specifications. `data/product.json` contains reusable product settings. `skill/SKILL.md` and `AGENTS.md` contain instructions for coding agents.

## GitHub handoff

```bash
git add .
git commit -m "Create runnable Exelo agent-ready landing app"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPO.git
git push -u origin main
```

The implementation intentionally mocks telephony, business scanning, billing, and backend persistence. The UI state and behavior are real; production integrations should be added behind clear service boundaries.

## Reference boundary

This repo is a functional and visual reconstruction derived from observing the public page at `https://exelo.ai/#how`. It does not contain private source code, credentials, private APIs, or proprietary production assets. Replace branding and copy when building a separate product or use it only with appropriate authorization.
