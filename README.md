# ahmadrezafarvardin.github.io

Personal site. Plain Jekyll, no theme, one stylesheet, one script.

    bundle install
    bundle exec jekyll serve    # http://localhost:4000

- `index.html`: home page (intro, selected work, teaching)
- `_projects/*.md`: one file per project. `group` is research / builds / coursework;
  `featured: true` puts it on the home page, ordered by `order`; `math: true` loads KaTeX.
- `cv.html`: HTML CV. The PDF lives at `assets/pdf/CV.pdf`.
- `assets/css/main.css`: colours are CSS variables at the top (light and dark).
- `assets/js/site.js`: theme toggle and the flow-field background.

Pushing to `main` builds the site and publishes it to the `gh-pages` branch (`.github/workflows/deploy.yml`).
