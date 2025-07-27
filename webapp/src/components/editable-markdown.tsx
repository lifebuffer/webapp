import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Edit, Save, X, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

interface EditableMarkdownProps {
  content: string;
  placeholder?: string;
  onSave: (content: string) => Promise<void>;
  className?: string;
}

export function EditableMarkdown({ 
  content, 
  placeholder = "Click to add notes...", 
  onSave,
  className = "" 
}: EditableMarkdownProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(content);
  const [isSaving, setIsSaving] = React.useState(false);

  // Update edit content when content prop changes
  React.useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(content); // Reset to original content
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={6}
          className="min-h-[120px] resize-y"
          autoFocus
          disabled={isSaving}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="flex items-center gap-1"
          >
            <Save className="h-3 w-3" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Press Ctrl/Cmd + Enter to save, Esc to cancel
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`group relative cursor-pointer rounded-md p-3 hover:bg-accent/50 transition-colors ${className}`}
      onClick={handleEdit}
    >
      {content.trim() ? (
        <div className="text-sm space-y-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-base font-semibold mb-2 mt-3">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-medium mb-1 mt-2">{children}</h3>,
              h4: ({ children }) => <h4 className="text-sm font-medium mb-1 mt-2">{children}</h4>,
              h5: ({ children }) => <h5 className="text-xs font-medium mb-1 mt-2">{children}</h5>,
              h6: ({ children }) => <h6 className="text-xs font-medium mb-1 mt-2">{children}</h6>,
              p: ({ children }) => <p className="text-xs leading-relaxed mb-2">{children}</p>,
              ul: ({ children }) => <ul className="text-xs space-y-1 ml-4 list-disc mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="text-xs space-y-1 ml-4 list-decimal mb-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/20 pl-3 italic text-muted-foreground text-xs mb-2">{children}</blockquote>,
              code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
              pre: ({ children }) => <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-muted-foreground italic">
          {placeholder}
        </p>
      )}
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyToClipboard();
          }}
          title="Copy to clipboard"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          title="Edit"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}