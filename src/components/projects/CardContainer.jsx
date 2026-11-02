import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { selectedTags } from "@stores/selectedTagsStore";
import { selectedSort } from "@stores/selectedSortStore";
import { getTagValues } from "@utils/getTags";
import { $projectData } from "@stores/projectSearchResultsStore";
import { $urlQuery } from "@stores/queryStore";

export default function CardContainer({
  url,
  title,
  tagsObj,
  tags,
  cardImage,
  cardContent,
  contentType,
  maxLength,
  sortOrder,
}) {
  const [visible, setVisible] = useState("relative");
  const [order, setOrder] = useState(0);
  const urlQuery = useStore($urlQuery);
  const projectData = useStore($projectData);
  const $selectedTags = useStore(selectedTags);
  const $selectedSort = useStore(selectedSort);
  const tagsArray = getTagValues(tagsObj);

  let contentData = null;
  if (contentType === "projects") {
    if (projectData) {
      contentData = projectData;
    }
  }

  function findMatchingIndex(contentData, title) {
    if (!contentData) {
      return -1;
    }
    const index = contentData.findIndex(
      (content) => content.item.title === title
    );
    return index;
  }

  //set card order in the grid (search results: Fuse score; otherwise the selected sort option;
  //otherwise random) and determine whether card is visible or not based on: search query, tag selections
  useEffect(() => {
    if (typeof window !== "undefined") {
      const matchingIndex = findMatchingIndex(contentData, title);
      let itemOrder;
      if (urlQuery !== "") {
        itemOrder = matchingIndex;
      } else if (sortOrder && Number.isInteger(sortOrder[$selectedSort])) {
        itemOrder = sortOrder[$selectedSort];
      } else {
        itemOrder = Math.floor(Math.random() * maxLength);
      }
      setOrder(itemOrder);

      const isSearchMatch =
        (urlQuery === "" &&
          (contentData === null || contentData.length === 0)) ||
        (contentData && matchingIndex !== -1);

      const hasMatchingTags =
        $selectedTags.length === 0 ||
        tagsArray.some((tag) => $selectedTags.includes(tag));
      const newVisibility =
        isSearchMatch && hasMatchingTags
          ? "relative"
          : "hidden";

      setVisible(newVisibility);
    }
  }, [
    $urlQuery,
    contentData,
    $selectedTags,
    $selectedSort,
    contentType,
  ]);

  return (
    <div
      style={{ order }}
      className={`${visible} col-span-1 w-full h-full mx-auto mb-4 bg-white dark:bg-slate-900 rounded-md shadow-md overflow-hidden border-gray-200 dark:border-slate-800 border-2 hover:shadow-lg transition duration-300 transform hover:scale-105`}
    >
      <a href={url} className="absolute top-0 left-0 bottom-0 right-0"></a>
      <div className="w-full h-40">
        {cardImage}
      </div>
      {cardContent}
      <div className="relative flex flex-wrap gap-2 px-4 py-2 pointer-events-none z-10">
        {tags}
      </div>
    </div>
  );
}
