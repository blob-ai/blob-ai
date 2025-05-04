
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Keyboard } from "lucide-react";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface KeyboardShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsGuide: React.FC<KeyboardShortcutsGuideProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "Formatting",
      shortcuts: [
        { keys: ["Ctrl/⌘", "B"], description: "Bold text" },
        { keys: ["Ctrl/⌘", "I"], description: "Italic text" },
        { keys: ["Ctrl/⌘", "U"], description: "Underline text" },
        { keys: ["Ctrl/⌘", "K"], description: "Insert link" },
      ],
    },
    {
      title: "Editor Actions",
      shortcuts: [
        { keys: ["Ctrl/⌘", "S"], description: "Save draft" },
        { keys: ["Ctrl/⌘", "Z"], description: "Undo" },
        { keys: ["Ctrl/⌘", "Shift", "Z"], description: "Redo" },
        { keys: ["Ctrl/⌘", "F"], description: "Find in text" },
        { keys: ["Ctrl/⌘", "H"], description: "Toggle history" },
      ],
    },
    {
      title: "View Controls",
      shortcuts: [
        { keys: ["Ctrl/⌘", "P"], description: "Preview mode" },
        { keys: ["Ctrl/⌘", "\\"], description: "Toggle AI panel" },
        { keys: ["Ctrl/⌘", "1"], description: "Twitter view" },
        { keys: ["Ctrl/⌘", "2"], description: "LinkedIn view" },
        { keys: ["Ctrl/⌘", "3"], description: "Facebook view" },
        { keys: ["Esc"], description: "Close any active dialog" },
      ],
    },
    {
      title: "AI Actions",
      shortcuts: [
        { keys: ["Ctrl/⌘", "Shift", "A"], description: "Ask AI assistant" },
        { keys: ["Alt", "R"], description: "Rewrite selected text" },
        { keys: ["Alt", "S"], description: "Shorten selected text" },
        { keys: ["Alt", "L"], description: "Lengthen selected text" },
        { keys: ["Alt", "G"], description: "Fix grammar" },
      ],
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[380px] sm:w-[540px] bg-[#12141A] border-l border-white/10 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-medium text-white/70">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 rounded-md hover:bg-white/5"
                  >
                    <span className="text-sm text-white/80">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, j) => (
                        <React.Fragment key={j}>
                          <kbd className="px-2 py-1 text-xs font-semibold text-white/90 bg-black/40 border border-white/10 rounded-md whitespace-nowrap">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span className="text-white/50">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/60 text-center">
            Press <kbd className="px-2 py-0.5 text-xs bg-black/40 border border-white/10 rounded-md">?</kbd> anywhere in the editor to show this guide
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default KeyboardShortcutsGuide;
