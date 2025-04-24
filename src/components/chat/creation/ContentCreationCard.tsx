import React, { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentSetup } from "@/types/setup";
import ContentCreationHeader from "./ContentCreationHeader";
import ContentInput from "./ContentInput";
import ContentExamples from "./ContentExamples";
import AdvancedOptions from "./AdvancedOptions";
import ContentCreationFooter from "./ContentCreationFooter";
import { SaveSetupModal } from "./SaveSetupModal";
import { toast } from "sonner";
import { goalOptions, formatOptions, hookOptions, toneOptions, templateOptions } from "./constants";

const emojiCategories = [
  {
    name: "Popular",
    emojis: ["🧵", "✨", "🔥", "🚀", "🌟", "💫"],
  },
  {
    name: "Reactions",
    emojis: ["👇", "👆", "👉", "💯", "🤝", "🙌"],
  },
  {
    name: "Objects",
    emojis: ["🧠", "💡", "🎯", "⚡", "🔍", "💪"],
  },
  {
    name: "Symbols",
    emojis: ["🌐", "📊", "💎", "🎨", "🏆", "⭐"],
  }
];

export type ExampleItem = {
  id: string;
  name: string;
  content: string;
};

type ContentCreationCardProps = {
  onClose: () => void;
  onGenerate: (data: ContentFormData) => void;
  initialData?: Partial<ContentFormData>;
  isEditing?: boolean;
  savedSetups?: ContentSetup[];
  onSaveSetup?: (name: string) => void;
};

export type ContentFormData = {
  title: string;
  content: string;
  examples: ExampleItem[];
  goal: string;
  format: string;
  hook: string;
  tone: string;
  customGoal?: string;
  customFormat?: string;
  customHook?: string;
  customTone?: string;
};

const templatePresets = {
  engagement: {
    goal: "community",
    format: "thread",
    hook: "question",
    tone: "conversational",
  },
  thought: {
    goal: "thought",
    format: "single",
    hook: "stat",
    tone: "authoritative",
  },
  growth: {
    goal: "growth",
    format: "poll",
    hook: "controversial",
    tone: "provocative",
  }
};

const ContentCreationCard: React.FC<ContentCreationCardProps> = ({
  onClose,
  onGenerate,
  initialData,
  isEditing = false,
  savedSetups = [],
  onSaveSetup,
}) => {
  const [title, setTitle] = useState(initialData?.title || "Draft Title");
  const [content, setContent] = useState(initialData?.content || "");
  const [examples, setExamples] = useState<ExampleItem[]>(
    initialData?.examples || []
  );
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(
    initialData?.goal !== undefined || initialData?.format !== undefined || 
    initialData?.hook !== undefined || initialData?.tone !== undefined
  );
  const [goal, setGoal] = useState(initialData?.goal || "");
  const [format, setFormat] = useState(initialData?.format || "");
  const [hook, setHook] = useState(initialData?.hook || "");
  const [tone, setTone] = useState(initialData?.tone || "");
  const [customGoal, setCustomGoal] = useState(initialData?.customGoal || "");
  const [customFormat, setCustomFormat] = useState(initialData?.customFormat || "");
  const [customHook, setCustomHook] = useState(initialData?.customHook || "");
  const [customTone, setCustomTone] = useState(initialData?.customTone || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{name: string, url: string}[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectTemplate = (templateType: string) => {
    const preset = templatePresets[templateType as keyof typeof templatePresets];
    if (preset) {
      setGoal(preset.goal);
      setFormat(preset.format);
      setHook(preset.hook);
      setTone(preset.tone);
      setShowAdvancedOptions(true);
      toast.success(`Applied ${templateType} template`);
    }
  };

  const handleSelectSetup = (setup: ContentSetup) => {
    if (setup.goal) setGoal(setup.goal);
    if (setup.format) setFormat(setup.format);
    if (setup.hook) setHook(setup.hook);
    if (setup.tone) setTone(setup.tone);
    if (setup.examples?.length) {
      const examplesWithIds = setup.examples.map(example => ({
        id: `example-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: example.name,
        content: example.content
      }));
      setExamples(examplesWithIds);
    }
    setShowAdvancedOptions(true);
    toast.success(`Applied ${setup.name} setup`);
  };

  const handleSaveSetup = (name: string) => {
    // We're going to create the ContentSetup object here, but we only pass the name to the parent
    if (onSaveSetup) {
      onSaveSetup(name);
    }
    
    setIsSaveModalOpen(false);
  };

  const handleGenerate = () => {
    onGenerate({
      title,
      content,
      examples,
      goal: goal === "custom" ? customGoal : goal,
      format: format === "custom" ? customFormat : format,
      hook: hook === "custom" ? customHook : hook,
      tone: tone === "custom" ? customTone : tone,
      customGoal,
      customFormat,
      customHook,
      customTone,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [...prev, {name: file.name, url: imageUrl}]);
      
      setContent(prev => `${prev}\n[Image: ${file.name}]\n`);
      
      toast.success(`Uploaded ${file.name}`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 shadow-lg font-sans relative">
      <ContentCreationHeader 
        title={title} 
        setTitle={setTitle} 
        onClose={onClose}
        savedSetups={savedSetups}
        onSelectSetup={handleSelectSetup}
      />

      <ScrollArea className="max-h-[70vh] overflow-y-auto">
        <div className="p-4">
          <ContentInput 
            content={content} 
            setContent={setContent} 
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />

          <ContentExamples examples={examples} setExamples={setExamples} />

          {showAdvancedOptions && (
            <AdvancedOptions
              goal={goal}
              setGoal={setGoal}
              format={format}
              setFormat={setFormat}
              hook={hook}
              setHook={setHook}
              tone={tone}
              setTone={setTone}
              customGoal={customGoal}
              setCustomGoal={setCustomGoal}
              customFormat={customFormat}
              setCustomFormat={setCustomFormat}
              customHook={customHook}
              setCustomHook={setCustomHook}
              customTone={customTone}
              setCustomTone={setCustomTone}
              goalOptions={goalOptions}
              formatOptions={formatOptions}
              hookOptions={hookOptions}
              toneOptions={toneOptions}
            />
          )}
        </div>
      </ScrollArea>

      {showEmojiPicker && (
        <div className="absolute bottom-[72px] left-[72px] z-50 bg-[#16181c] rounded-lg shadow-lg border border-white/10 overflow-hidden">
          <div className="p-3 grid grid-cols-5 gap-2">
            {emojiCategories.map((category) => 
              category.emojis.map((emoji, index) => (
                <button
                  key={`${category.name}-${index}`}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded text-xl"
                  onClick={() => {
                    if (textareaRef.current) {
                      const startPos = textareaRef.current.selectionStart || 0;
                      const endPos = textareaRef.current.selectionEnd || 0;
                      const newText = content.substring(0, startPos) + emoji + content.substring(endPos);
                      setContent(newText);
                      
                      setTimeout(() => {
                        if (textareaRef.current) {
                          textareaRef.current.focus();
                          const newPosition = startPos + emoji.length;
                          textareaRef.current.setSelectionRange(newPosition, newPosition);
                        }
                      }, 0);
                    } else {
                      setContent(content + emoji);
                    }
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <ContentCreationFooter
        showAdvancedOptions={showAdvancedOptions}
        setShowAdvancedOptions={setShowAdvancedOptions}
        handleGenerate={handleGenerate}
        isEditing={isEditing}
        onImageClick={handleImageClick}
        onEmojiClick={handleEmojiClick}
        onSaveSetup={() => setIsSaveModalOpen(true)}
      />

      <SaveSetupModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveSetup}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ContentCreationCard;
