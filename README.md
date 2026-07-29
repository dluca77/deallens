# DealLens AI

Upload een screenshot van een product. DealLens AI herkent het product, vergelijkt prijzen bij verschillende
webshops en zoekt beschikbare kortingscodes.

Dit is een MVP gebouwd met Next.js (App Router), TypeScript en Tailwind CSS. De AI-herkenning, prijsvergelijking
en kortingscodecontrole zijn in deze versie **gesimuleerd met demodata** (`src/lib/demo-data.ts`), zodat de
volledige gebruikersflow direct getest kan worden. De architectuur is modulair opgezet zodat de demodata later
vervangen kan worden door echte vision-AI-, shopping- en kortingscode-API's (zie de datamodellen in
`src/lib/types.ts`).

## Belangrijkste pagina's

- `/` — Homepage met hero, uitleg en voorbeelden
- `/scan` — Upload, productselectie, AI-analyse en productbevestiging
- `/results` — Prijsvergelijking, beste deal, kortingscodes en alternatieven
- `/compare` — Vergelijk tot vier resultaten naast elkaar
- `/dashboard`, `/saved`, `/alerts`, `/history` — Persoonlijke omgeving
- `/login`, `/register`, `/account`, `/pricing` — Account en abonnementen
- `/privacy`, `/terms` — Juridische pagina's
- `/admin` — Beheerdersomgeving met statistieken en beheer

## Ontwikkelen

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```
