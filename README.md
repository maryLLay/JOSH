# Janelia Open Source Hardware (JOSH) website

## Overview

- The source code for the Janelia Open Source Hardware (JOSH) website, a catalogue of open source hardware developed by teams at Janelia Research Campus.
- Each project page links to where the design files are hosted (GitHub, Figshare or another site) and shows the file types, license, design tools and other tags, so visitors can check what they need before downloading.
- Built with the static-site-generator [Astro](https://github.com/withastro/astro).

## Janelians: add your hardware to this website

We welcome contributions from current and former Janelians. Refer to the [contributing guidelines](CONTRIBUTING.md) to get started, or contact laym@janelia.hhmi.org.

## Development

Requires Node.js 22.23.4 or later.

```
npm install
npm run dev      # local dev server at localhost:4321
npm run build    # static build into dist/
```

Project pages fetch their README (GitHub) or description (Figshare) while the site is built. For GitHub, set a `GITHUB_TOKEN` environment variable to avoid GitHub's low rate limit for unauthenticated requests; the deploy workflow does this automatically. If a fetch fails, the build logs a warning and the page uses the project file's own text instead.

A weekly workflow (`.github/workflows/update-project-dates.yml`) fills in each project's `update_date` from its GitHub or Figshare record, using `.github/actions/update-project-dates.js`, commits the result to `main` and starts a deploy. If `main` is protected, the workflow needs permission to push to it. You can also run the script locally with `node .github/actions/update-project-dates.js` after `npm ci` in `.github/actions`.

The deploy workflow publishes to GitHub Pages on every push to `main` and rebuilds nightly so fetched content stays current. If the site is served from a repository subpath (`https://<org>.github.io/<repo>/`), the base path is applied automatically. For a custom domain, configure it in the repository's Pages settings (plus a DNS record); the workflow picks up the site URL automatically. Update the placeholder `site` in `astro.config.mjs` to match, for local builds.

## Licensing

Different parts of this repository are under different terms.

| What | License |
| :-- | :-- |
| The website's source code and documentation | [3-clause BSD](LICENSE-3-clause-BSD.md), Copyright © HHMI |
| Files adapted from the [AstroWind](https://github.com/onwidget/astrowind) template: `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ToggleTheme.astro`, `src/styles/CustomStyles.astro` and `src/styles/tailwind.css` | [MIT](LICENSE-MIT.md), Copyright © 2023 onWidget (the MIT notice must be kept with these files) |
| HHMI and Janelia logos (`src/assets/images`) | Trademarks of HHMI, not covered by the BSD license |
| The two `*-unsplash.jpg` placeholder images in `public/project-images` | [Unsplash License](https://unsplash.com/license) |
| Other project images, and each project's description, README and design files | Belong to their project's authors and are shared under the license shown on each project page |

Hardware designs listed on the site are **not** covered by this repository's license. Each project page shows its own license, and some projects may not meet the [OSHWA open source hardware definition](https://oshwa.org/resources/open-source-hardware-definition/).

## Acknowledgments

- This site is adapted from the [Janelia Open Science Software Initiative website](https://github.com/JaneliaSciComp/ossi-website).
- It uses components and styling from the [Astrowind](https://github.com/onwidget/astrowind/tree/main) template. AstroWind is licensed under the [MIT license](LICENSE-MIT.md).
- The GitHub action validating tags in the project frontmatter was heavily inspired by [lint-md-fm](https://github.com/timhagn/lint-md-fm) and [Flinter](https://github.com/JackDevAU/Flinter).
