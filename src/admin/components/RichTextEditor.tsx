import React, { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Link as LinkIcon, Quote } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TOOLBAR_ACTIONS: { icon: React.ComponentType<{ className?: string }>; command: string; arg?: string; label: string }[] = [
  { icon: Bold, command: "bold", label: "Bold" },
  { icon: Italic, command: "italic", label: "Italic" },
  { icon: Underline, command: "underline", label: "Underline" },
  { icon: Heading2, command: "formatBlock", arg: "H2", label: "Heading" },
  { icon: Quote, command: "formatBlock", arg: "BLOCKQUOTE", label: "Quote" },
  { icon: List, command: "insertUnorderedList", label: "Bullet List" },
  { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List" },
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    isInternalUpdate.current = false;
  }, [value]);

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  return (
    <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-neutral-700 p-2 bg-slate-50 dark:bg-neutral-800 flex-wrap">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.label}
            onClick={() => exec(action.command, action.arg)}
            className="p-1.5 rounded hover:bg-white dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300"
          >
            <action.icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onClick={handleLink}
          className="p-1.5 rounded hover:bg-white dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[160px] p-3.5 text-xs leading-relaxed focus:outline-none prose-sm empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        suppressContentEditableWarning
      />
    </div>
  );
}
