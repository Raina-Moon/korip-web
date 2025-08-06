"use client";

import React from "react";

interface HTMLViewerProps {
  html: string;
}

const HTMLViewer: React.FC<HTMLViewerProps> = ({ html }) => {
  return (
    <div
      className="prose max-w-none prose-img:rounded-lg prose-img:mx-auto prose-p:leading-relaxed prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HTMLViewer;
