import { truncateText } from "@/lib/utils";
import React, { useState } from "react";

interface ReadMoreTextProps {
  text?: string | null;
  buttonClassName?: string;
  length?: number;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  buttonClassName,
  length = 200,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > length;
  const toggle = () => setExpanded(!expanded);

  return (
    <span>
      {expanded || !isLong ? text : truncateText(text, length)}
      {isLong && (
        <button type="button" onClick={toggle} className={buttonClassName}>
          {expanded ? " Read less" : " Read more"}
        </button>
      )}
    </span>
  );
};

export default ReadMoreText;
