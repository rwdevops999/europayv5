"use client";

import React from "react";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

type ParseContentProps = { content?: string | null };

const ParseContent = ({ content }: ParseContentProps) => (
  <div>{content && parse(DOMPurify.sanitize(content))}</div>
);

export default ParseContent;
