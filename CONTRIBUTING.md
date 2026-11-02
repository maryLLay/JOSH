# Contributing Guidelines

How to add or edit a hardware project on the JOSH website. Each project is one Markdown file in `src/content/projects/`.

## Contents

- [Quick reference](#quick-reference)
- [Prerequisites](#prerequisites)
- [Set-up](#set-up)
- [Add a new project](#add-a-new-project)
- [The frontmatter fields](#the-frontmatter-fields)
- [Where your project is hosted](#where-your-project-is-hosted)
- [Tags](#tags)
- [Optional: project description and image](#optional-project-description-and-image)
- [Preview your page](#preview-your-page)
- [Open a pull request](#open-a-pull-request)
- [Removing the placeholder projects](#removing-the-placeholder-projects)

## Quick reference

1. Fork and clone this repository.
2. Copy `src/content/projects/_project-template.md`, rename it for your project, and fill in the frontmatter.
3. Preview it locally, then open a pull request against `main`. An automated check validates your tags.

## Prerequisites

1. A [GitHub account](https://docs.github.com/en/get-started/quickstart/creating-an-account-on-github).
2. A code editor (for example [Visual Studio Code](https://code.visualstudio.com/download)).
3. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
4. [Node.js](https://nodejs.org/en/download) 22.23.4 or later, which includes npm.

To check your installs, run `git -v`, `node -v` and `npm -v` in a terminal. Each should print a version number.

## Set-up

1. On GitHub, open this repository and click **Fork** (upper right). The defaults are fine.
2. On your fork, click the green **Code** button, choose the **SSH** tab and copy the address. If GitHub reports you have no SSH key, [generate one](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [add it to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
3. In a terminal, move to where you want the project and clone your fork:

   ```
   git clone git@github.com:YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

4. Install dependencies and start the local dev server:

   ```
   npm install
   npm run dev
   ```

   If the site does not open on its own, go to `localhost:4321`. The server is ready when the terminal prints a line like "ready in 317 ms".

## Add a new project

**If a file for your project already exists in `src/content/projects/`, skip to [The frontmatter fields](#the-frontmatter-fields).**

1. Copy `src/content/projects/_project-template.md` into the same folder.
2. Rename the copy after your project, in **lowercase with dashes instead of spaces**, for example `head-positioner.md`. The file name becomes the page address (`/projects/head-positioner/`).
3. Open the file. The data between the triple dashes (`---`) at the top is called **frontmatter**, and it fills in the project page.

## The frontmatter fields

Follow the examples in `_project-template.md`.

- Every **required** field needs a value, or the site will show an error when you preview the page.
- For an **optional** field you do not want, delete the whole entry or comment it out with `#`.
- If a value contains a colon, wrap the whole value in quotes. If it also needs quotation marks, use single quotes inside and wrap the value in double quotes.

| Field | Required? | How to complete |
| :-- | :-- | :-- |
| `title` | Required | Your project title. |
| `tagline` | Required | One or two sentences describing the project. |
| `maintainer` | Required | The one person responsible for this page. Used internally and not shown on the site. |
| `repository link` | Required | Where the project is hosted. See [Where your project is hosted](#where-your-project-is-hosted). |
| `update_date` | Do not set for GitHub or Figshare projects | Filled in automatically every week from the repository's last push (GitHub) or last modified date (Figshare), and used for the "Last updated" sort. For projects hosted elsewhere you may add it yourself as `YYYY-MM-DD`; without it the project is listed last when sorting by date. |
| `documentation link` | Optional | Link to documentation, if separate from the repository link. |
| `preferred contact method` | Optional | A link or `mailto:` address for the "Reach out with a question" button. |
| `how to cite text` | Optional | A citation. Overrides the citation supplied by the repository (see below). Wrap in quotes. |
| `how to cite link` | Optional | A DOI link, starting `https://doi.org/`. Only used together with `how to cite text`. |
| `additional links array` | Optional | Extra links as a list, for example a project homepage or a publication. Wrap links containing a colon in quotes. |
| `additional links text array` | Optional | The display text for each extra link, in the same order. |
| `image file` | Optional | The file name of an image in `public/project-images/`, with no spaces. One image is supported. |
| `image caption` | Required if you add an image | A short description of the image. |
| `youtube url` | Optional | Link to a YouTube video. |
| `youtube caption` | Required if you add a video | A short description of the video. |
| `youtube params` | Optional | Any [YouTube player parameters](https://developers.google.com/youtube/player_parameters#Parameters). |
| `file types`, `license`, `hardware type`, `development team`, `CAD/EDA`, `use case` | Optional | [Tags](#tags). |

## Where your project is hosted

Set `repository link` to the main page of your project. The site fetches details from it when the site is built.

| Host | What to use | What appears on the project page |
| :-- | :-- | :-- |
| **Figshare** | The clean record URL, for example `https://janelia.figshare.com/articles/physical_object/Project_name/12345678`. Remove any `?file=...` ending. | The record's description, authors, DOI, license, publish date and citation. If the record's file entry links to another site such as GitHub, that appears as "Project files on GitHub". |
| **GitHub** | The repository URL, for example `https://github.com/ORG/REPO`. The repository must be public. | The repository's README, and an "Open an issue on GitHub" link. |
| **Anywhere else** (for example Janelia.org or Flintbox) | The project's page URL. | Nothing is fetched. Write the page content in the body of your project file (below the closing `---`). |

Notes:

- The fetched content is shown for display only. Filters and search use your frontmatter tags.
- Citation priority: your `how to cite text`, then the citation from the Figshare record, then a link to the repository.
- If a fetch fails when the site is built, the page falls back to any text in the body of your project file.
- Text you write in the body of your project file always replaces the fetched README or description.

## Tags

Visitors can also sort the cards alphabetically or by last update, newest or oldest first.

Tags let visitors filter projects. The tag fields are `file types`, `license`, `hardware type`, `development team`, `CAD/EDA` and `use case`.

- **Use only the options in [`.github/actions/validTagsList.json`](.github/actions/validTagsList.json)**, which is the list the automated check uses. Spelling and capitalization must match exactly.
- Keep the options that apply, inside square brackets and separated by commas. Delete the options that do not apply. If a whole category does not apply, delete or comment out the category.
- **List every file type in your download**, including proprietary ones. Options marked "(proprietary)" need commercial software to open, so visitors know this before they download.
- If you feel an extra tag **option** is needed, add it to your project file and say so in your pull request. The check will flag it for the maintainer to review.
- If you feel an extra tag **category** is needed, do not add it to your project file. Open a separate pull request that explains why.

## Optional: project description and image

**Description.** Leave the body of your project file empty to show the fetched README or description. To write your own, type Markdown below the closing `---` ([Markdown syntax guide](https://www.markdownguide.org/basic-syntax/)). If the template's instruction text is still there, it is ignored.

**Image.** Add the image to `public/project-images/` with a file name without spaces, then set `image file` and `image caption`. The image is used on the project's card.

## Preview your page

1. Save your changes and make sure the dev server is running (`npm run dev`).
2. Open `localhost:4321/projects/YOUR-FILE-NAME`. You should also see your project on the main page and in the table view.

When you are happy with it, commit and push:

```
git add src/content/projects/YOUR-FILE-NAME.md
git commit -m "Add YOUR PROJECT NAME"
git push origin main
```

If you added an image, also run `git add public/project-images/YOUR-IMAGE-FILE`. If you are working on a branch instead of `main`, use its name in the last command.

## Open a pull request

1. On your fork on GitHub, choose **Pull requests**, then **New pull request**.
2. Check that the base repository is this repository with base `main`, and that the head is your fork and branch.
3. Click **Create pull request**. Title it "Add YOUR PROJECT NAME" or "Edit YOUR PROJECT NAME", and optionally add details. Leave **Allow edits by maintainers** checked.

An automated check then validates your tags. If it finds a problem, it posts a comment on your pull request. Fix the file, then commit and push again. The changes are added to the open pull request, and a success comment appears once the tags are valid.

The maintainers may ask for changes before approving your pull request. Thank you for contributing!

## Removing the placeholder projects

The three `src/content/projects/placeholder-*.md` files are examples used during development, with illustrative tags. Delete them once real projects have been added.
