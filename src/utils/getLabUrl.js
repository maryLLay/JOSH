import { allLabNamesAndUrls } from "@data/labNamesUrls";

// Takes the "development team" tag value(s) and returns [{ name, url }],
// where url is null if no link has been configured for that team.
export function findLabInfo(labNames) {
  if (!labNames) {
    return [];
  }
  if (!Array.isArray(labNames)) {
    labNames = [labNames];
  }

  return labNames.map((labName) => {
    const labData = allLabNamesAndUrls.find((entry) => entry[0] === labName);
    return { name: labName, url: labData ? labData[1] : null };
  });
}
