import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { selectedTags } from "@stores/selectedTagsStore.js";
import { $urlQuery } from "@stores/queryStore.js";
import { $projectData } from "@stores/projectSearchResultsStore.js";
import { getTagValues } from "@utils/getTags.js";

export default function ProjectCount({ allContent, contentType }) {
  const urlQuery = useStore($urlQuery);
  const projectData = useStore($projectData);

  let contentData = null;
  if (contentType === "projects") {
    if (projectData) {
      contentData = projectData;
    }
  }

  const $selectedTags = useStore(selectedTags);

  const [shownCardCount, setShownCardCount] = useState(allContent.length);

  // Calculate the count of shown contentCard components to display if selectedTags changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const filteredCount = allContent.filter((entry) => {
        const isSearchMatch =
          (urlQuery === "" &&
            (contentData === null || contentData.length === 0)) ||
          (contentData &&
            contentData.some(
              (content) => content.item.title === entry.data.title
            ));

        const tagsArray = getTagValues(entry.data);
        //we are only interested in projects with matching tags to selectedTags (or if there are no selectedTags)
        const hasMatchingTags =
          $selectedTags.length === 0 ||
          tagsArray.some((tag) => $selectedTags.includes(tag));
        return isSearchMatch && hasMatchingTags;
      }).length;

      setShownCardCount(filteredCount);
    }
  }, [
    $selectedTags,
    contentData,
    urlQuery,
    allContent,
    contentType,
  ]);

  return (
    <p className="font-semibold text-lg py-4">
      Showing {shownCardCount} of {allContent.length} {contentType}
    </p>
  );
}
