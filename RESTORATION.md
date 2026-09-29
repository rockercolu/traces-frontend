# CiteShare / Traces Restoration (2026)

This branch preserves and restores the surviving 2015–2016 CiteShare / Traces frontend.

## Preservation rule
The historical `master` branch remains untouched. Changes here should be limited to compatibility, documentation, and faithful restoration until the original interaction is runnable and documented.

## Historical interaction
The surviving prototype organizes writing as movable objects:

**Thesis / evidence → Outline → Draft**

Theses and quotes carry types, IDs, keywords, and source/citation fields. Drag-and-drop rules govern movement between pools and the outline. The outline then becomes the basis of the editable draft.

## Run
```bash
npm install
npm start
```

Open `http://localhost:8888/app/`.

## Known restoration issues
- The original stack used AngularJS 1.2, Bower, jQuery 2.x, and Node 0.12-era tooling.
- The original Google Code CryptoJS URL is dead; this branch substitutes a compatible HTTPS CDN copy.
- Bower-era package resolution may still require additional compatibility work.
- Restoration comes before redesign. Modern spatial experiments should be separated from the faithful historical version.

## Design archaeology question
> What did old CiteShare see that new CiteShare forgot?
