import { useState, useEffect } from "react";
import { getRandomImage } from "@utils/getRandomImage";
import { withBase } from "@utils/withBase";

export default function ContentCardImage() {
  const placeholderProjectImages = [
    "Bg0Geue-cY8",
    "f4pUuCc3M0g",
  ];
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    setRandomImage(getRandomImage(placeholderProjectImages));
  }, []);

  return (
    <img
      src={withBase(`/project-images/${randomImage}-unsplash.jpg`)}
      className="w-full h-40 object-cover object-center"
      loading="lazy"
    />
  );
}
