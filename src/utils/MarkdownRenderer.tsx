import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { cn } from "./utils";
import Label from "../components/atoms/display/Label";
import Badge from "../components/atoms/display/Badge";

export interface MarkdownRendererProps {
  content: string;
  mindAppChat?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Parse table markdown into JSX table structure using reusable components
const parseTable = (tableContent: string): React.ReactNode => {
  if (!tableContent) return null;

  const lines = tableContent
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const separatorLine = lines[1];
  const bodyLines = lines.slice(2);

  // Parse header
  const headers = headerLine
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell);

  // Parse body rows
  const rows = bodyLines
    .map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell)
    )
    .filter((row) => row.length > 0);

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="custom-table-cell head-bg">
                <Label
                  size="sm"
                  weight="semibold"
                  style={{ lineHeight: "1.75rem" }}
                >
                  {header}
                </Label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="custom-table-cell row-bg">
                  <span style={{ lineHeight: "1.75rem" }}>{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  mindAppChat = false,
  className = "",
  style = {},
}) => {
  const escapedContent = mindAppChat
    ? content?.replace(/~/g, "\\~")
    : content?.replace(/~/g, "\\~")?.replace(/\n/g, "  \n");

  return (
    <div
      className={cn("markdown-renderer", className)}
      style={{ ...style, lineHeight: "1.75rem" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
              style={{ lineHeight: "1.75rem" }}
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="table-wrapper">
              <table className="custom-table">{children}</table>
            </div>
          ),
          th: ({ children, style: cellStyle }) => (
            <th
              className={cn(
                "custom-table-cell head-bg",
                cellStyle?.textAlign ? `align-${cellStyle.textAlign}` : ""
              )}
            >
              <Label size="sm" weight="semibold">
                {children}
              </Label>
            </th>
          ),
          td: ({ children, style: cellStyle }) => (
            <td
              className={cn(
                "custom-table-cell row-bg",
                cellStyle?.textAlign ? `align-${cellStyle.textAlign}` : ""
              )}
            >
              <span>{children}</span>
            </td>
          ),
          ul: ({ children }) => (
            <ul className="custom-list pl-8" style={{ lineHeight: "1.75rem" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="custom-list list-decimal pl-12"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </ol>
          ),
          li: ({ children, node }) => {
            const isInsideOl =
              (node as any)?.parent?.type === "list" &&
              (node as any)?.parent?.ordered;

            const unwrapElements = (child: any) => {
              if (typeof child === "object" && child?.type === "p") {
                return child.props.children;
              }
              if (
                isInsideOl &&
                typeof child === "object" &&
                child?.type === "strong"
              ) {
                return child.props.children;
              }
              return child;
            };

            const cleanChildren = Array.isArray(children)
              ? children.map(unwrapElements)
              : unwrapElements(children);

            return (
              <li
                className="custom-list-item"
                style={{
                  listStyleType: isInsideOl ? "none" : "inherit",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                  lineHeight: "1.75rem",
                }}
              >
                {cleanChildren}
              </li>
            );
          },
          h1: ({ children }) => (
            <Label
              size="lg"
              weight="bold"
              className="custom-heading h1 block mb-4 text-2xl"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          h2: ({ children }) => (
            <Label
              size="lg"
              weight="bold"
              className="custom-heading h2 block mb-3 text-xl"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          h3: ({ children }) => (
            <Label
              size="lg"
              weight="semibold"
              className="custom-heading h3 block mb-2"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          h4: ({ children }) => (
            <Label
              size="md"
              weight="semibold"
              className="custom-heading h4 block mb-2"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          h5: ({ children }) => (
            <Label
              size="sm"
              weight="semibold"
              className="custom-heading h5 block mb-1"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          h6: ({ children }) => (
            <Label
              size="sm"
              weight="semibold"
              className="custom-heading h6 block mb-1 text-xs"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </Label>
          ),
          pre: ({ children }) => {
            const getContent = (node: any): string => {
              if (typeof node === "string") {
                return node;
              }
              if (typeof node === "object" && node?.props?.children) {
                return Array.isArray(node.props.children)
                  ? node.props.children.map(getContent).join("")
                  : getContent(node.props.children);
              }
              return "";
            };

            const content = Array.isArray(children)
              ? children.map(getContent).join("")
              : getContent(children);

            const headingRegex = /^#\s(.*)/m;
            const tableRegex = /((?:\|.*\|.*\n)+\|[-| ]+\|.*(?:\n\|.*\|.*)*)/m;
            const headingMatch = content.match(headingRegex);
            const tableMatch = content.match(tableRegex);

            const heading = headingMatch ? headingMatch[1] : null;
            const tableContent = tableMatch ? tableMatch[1] : null;

            const isTable = !!tableContent;

            if (isTable) {
              return (
                <pre 
                  className="code-block"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    overflowWrap: "anywhere",
                    overflow: "auto"
                  }}
                >
                  {heading && (
                    <Label
                      size="md"
                      weight="semibold"
                      className="table-heading block mb-2"
                    >
                      {heading}
                    </Label>
                  )}
                  {parseTable(tableContent)}
                </pre>
              );
            }

            return (
              <pre
                className="code-block mb-4"
                style={{ 
                  lineHeight: "1.75rem",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "anywhere",
                  overflow: "auto"
                }}
              >
                {children}
              </pre>
            );
          },
          code: ({ inline, children, ...props }: any) =>
            inline ? (
              <Badge
                variant="outline"
                color="secondary"
                className="inline-code font-mono text-xs"
              >
                {children}
              </Badge>
            ) : (
              <code
                className="block p-3 rounded font-mono text-sm"
                style={{ 
                  lineHeight: "1.75rem",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "anywhere",
                  overflow: "auto"
                }}
              >
                {children}
              </code>
            ),
          p: ({ children }) => (
            <p style={{ lineHeight: "1.75rem", marginBottom: "8px" }}>
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic"
              style={{ lineHeight: "1.75rem" }}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {escapedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
