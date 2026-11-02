---
title: Required. Your project title.
tagline: "Required. 1-2 sentences that describe your project. An aside: if you use a colon in a field value, you must wrap the entire phrase in quotes. Otherwise, quotes are not required."
maintainer: Required. Name of the person responsible for maintaining this project page. For internal use/reference - not posted to the website.
repository link: "Required. Where the project is hosted - a GitHub repository or a Figshare record (use the clean article URL, without any ?file=... part). For GitHub and Figshare links, the README or description is fetched when the site is built. Any other link (for example a Janelia.org page or Flintbox) is also fine; in that case, write the page content in the body of this file."
#documentation link - Optional. Delete this line if the repository link already serves as the documentation.
documentation link: https://optional-link-to-documentation.com
preferred contact method: "Creates the link for the 'Reach out with a question' button on the project page. Encouraged if there is a preferred way for users to reach out for help other than creating an issue in the project's GitHub repo. Example: an email in the format of mailto:email@example.com."
how to cite text: "Optional. Figshare records supply their own citation, so this is usually only needed for GitHub or other hosts. If provided, it takes priority over the repository's citation - wrap in quotes to ensure colons are interpreted correctly."
how to cite link: "https://doi.org/example - optional, wrap entire link in quotes. Only used together with 'how to cite text'."
additional links array:
  [
    Optional additional external links,
    For example - to a project hompage,
    External blog posts,
    Additional related publications,
    Etc.,
  ]
additional links text array:
  [
    Optional. The display text you wish to appear for each link provided above,
    Display text for link 2,
    Display text for link 3,
    Display text for link 4,
    Etc.,
  ]
image file: optional-file-name.jpg
image caption: Required if you provide an image file
youtube url: https://optional-youtube-url.com
youtube caption: Required if you provide a youtube url
youtube params: "Optional. Supports any YouTube params: https://developers.google.com/youtube/player_parameters#Parameters. See Astro Embed documentation for more guidance: https://astro-embed.netlify.app/components/youtube/#params"
#Optional "tag" fields. Select tags from the options in .github/actions/validTagsList.json - keep only the ones that apply and delete the rest. If you feel another option is required to describe your project, add it and then note this in your pull request.
#file types - list every file type in the download, including proprietary ones, so users know before they download. Proprietary types are marked "(proprietary)" in the tag list.
file types: [STEP, STL, SolidWorks (proprietary)]
license: [CERN-OHL-S-2.0]
hardware type: [Microscope]
development team: [Janelia Experimental Technology (jET)]
CAD/EDA: [SolidWorks]
use case: [Light-sheet microscopy]
---

Optional. Leave this body empty to show the README (GitHub) or description (Figshare) fetched from the repository link. Write Markdown here instead to replace it, or to provide the page content for any other host. If you need to provide an alternative description for a GitHub or Figshare project, replace this text.
