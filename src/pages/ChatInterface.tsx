import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { CardContainer } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AtSign, FileText, SendHorizontal, Sparkles, Plus, Link as LinkIcon, FileCode, CheckCircle, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ContentCreationCard from "@/components/chat/creation/ContentCreationCard";
import ContentPreviewCard from "@/components/chat/ContentPreviewCard";
import PostAnalyzeCard from "@/components/chat/PostAnalyzeCard";
import PostAnalysisResult from "@/components/chat/PostAnalysisResult";
import SuggestionChips from "@/components/chat/SuggestionChips";
import { ContentSetup as TypedContentSetup, TemplateVariable } from "@/types/setup";
import { toast } from "@/hooks/use-toast";
import { useChat, ChatMessage, ContentSetup as ContextContentSetup } from "@/contexts/ChatContext";
import { useParams, useNavigate } from "react-router-dom";
import TemplateSelectionCard from '@/components/chat/template/TemplateSelectionCard';
import ExtractTemplateCard from '@/components/chat/template/ExtractTemplateCard';
import SelectExistingTemplateCard from '@/components/chat/template/SelectExistingTemplateCard';
import { v4 as uuidv4 } from 'uuid';
import { TemplateDialog } from "@/components/chat/template/TemplateDialog";
import UserMessageContent from "@/components/chat/UserMessageContent";
import AssistantMessageContent from '@/components/chat/AssistantMessageContent';
type AccountTag = {
  handle: string;
  display: string;
};
type ContentTag = {
  type: 'post' | 'link';
  content: string;
};
type Post = {
  id: string;
  url?: string;
  content: string;
};
type ChatMode = "idle" | "create_content" | "analyze_posts";
type Step = "initial" | "collecting" | "generating" | "complete";
const ChatInterface = () => {
  const {
    messages: contextMessages,
    currentThread,
    isTyping: contextIsTyping,
    sendMessage,
    createThread,
    handleAnalyzeContent,
    handleCreateContent,
    loadContentSetups,
    saveContentSetup
  } = useChat();
  const {
    threadId
  } = useParams<{
    threadId: string;
  }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [accountTags, setAccountTags] = useState<AccountTag[]>([]);
  const [contentTags, setContentTags] = useState<ContentTag[]>([]);
  const [tempAccountTag, setTempAccountTag] = useState("");
  const [tempContentTag, setTempContentTag] = useState("");
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [chatMode, setChatMode] = useState<ChatMode>("idle");
  const [step, setStep] = useState<Step>("initial");
  const [showContentCard, setShowContentCard] = useState(false);
  const [showAnalyzeCard, setShowAnalyzeCard] = useState(false);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentFormData, setContentFormData] = useState<any | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [showSuggestionChips, setShowSuggestionChips] = useState(false);
  const [savedSetups, setSavedSetups] = useState<TypedContentSetup[]>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contextMessages && contextMessages.length > 0) {
      setShowEmptyState(false);
    } else {
      setShowEmptyState(true);
    }
  }, [contextMessages]);
  useEffect(() => {
    const loadSetups = async () => {
      const setups = await loadContentSetups();
      const typedSetups: TypedContentSetup[] = setups.map(setup => ({
        id: setup.id || '',
        name: setup.name || `Template ${setups.indexOf(setup) + 1}`,
        goal: setup.configuration?.goal || '',
        format: setup.configuration?.format || '',
        hook: setup.configuration?.hook || '',
        tone: setup.configuration?.tone || '',
        examples: setup.examples || [],
        isTemplate: setup.isTemplate || false
      }));
      setSavedSetups(typedSetups);
    };
    loadSetups();
  }, [loadContentSetups]);
  const ensureExclusiveUIState = (showing: 'content' | 'analyze' | 'none') => {
    if (showing === 'content') {
      setShowContentCard(true);
      setShowAnalyzeCard(false);
      setShowAnalysisResults(false);
    } else if (showing === 'analyze') {
      setShowContentCard(false);
      setShowAnalyzeCard(true);
      setShowAnalysisResults(false);
    } else {
      setShowContentCard(false);
      setShowAnalyzeCard(false);
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [contextMessages, showContentCard, showAnalyzeCard, showAnalysisResults]);
  useEffect(() => {
    if (contextMessages.length > 0 && !showEmptyState) {
      setShowSuggestionChips(true);
    } else {
      setShowSuggestionChips(false);
    }
  }, [contextMessages, showEmptyState]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() || accountTags.length > 0 || contentTags.length > 0) {
      let fullMessage = "";
      if (accountTags.length > 0) {
        const accountsText = accountTags.map(tag => `@${tag.handle}`).join(" ");
        fullMessage += accountsText + " ";
      }
      if (contentTags.length > 0) {
        contentTags.forEach(tag => {
          if (tag.type === 'link') {
            fullMessage += `${tag.content} `;
          } else {
            fullMessage += `[${tag.content}] `;
          }
        });
      }
      fullMessage += inputValue;
      setInputValue("");
      setAccountTags([]);
      setContentTags([]);
      setShowEmptyState(false);
      let activeThreadId = threadId;
      if (!activeThreadId) {
        try {
          activeThreadId = await createThread();
          navigate(`/dashboard/chat/${activeThreadId}`);
        } catch (error) {
          console.error("Error creating thread:", error);
          toast({
            title: "Error",
            description: "Failed to create a new chat thread",
            variant: "destructive"
          });
          return;
        }
      }
      await sendMessage(fullMessage.trim(), activeThreadId);

      // Check for feature-triggering messages
      const lowercasedMessage = fullMessage.toLowerCase();

      // Analyze posts patterns
      if (lowercasedMessage.includes("analyze") || lowercasedMessage.includes("viral") || lowercasedMessage.includes("performance") || lowercasedMessage.includes("trending") || lowercasedMessage.includes("what makes posts successful")) {
        handleStartAnalyze();
      }
      // Content creation patterns
      else if (lowercasedMessage.includes("create content") || lowercasedMessage.includes("write a post") || lowercasedMessage.includes("draft") || lowercasedMessage.includes("generate content") || lowercasedMessage.includes("content creation") || lowercasedMessage.includes("help me write")) {
        handleStartContentCreation();
      }
      // Template patterns
      else if (lowercasedMessage.includes("template") || lowercasedMessage.includes("format") && lowercasedMessage.includes("content") || lowercasedMessage.includes("reuse") && lowercasedMessage.includes("structure")) {
        handleStartTemplate();
      }
    }
  };
  const handleTemplateExtraction = async (content: string, name: string, detectedVariables: TemplateVariable[] = []) => {
    setShowTemplateDialog(false);
    if (!threadId) {
      toast({
        title: "Error",
        description: "No active chat thread",
        variant: "destructive"
      });
      return;
    }
    const variableRegex = /\[([^\]]+)\]/g;
    let match;
    const variables = [];
    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    if (variables.length === 0) {
      toast({
        title: "No variables detected",
        description: "Try adding some variables in [BRACKETS] to make this a useful template",
        variant: "default"
      });
    }
    await sendMessage(`I'm saving a new template called "${name}" with the following content:\n\n${content}`, threadId);
    const templateId = uuidv4();
    const newTemplate: TypedContentSetup = {
      id: templateId,
      name: name,
      isTemplate: true,
      goal: '',
      format: '',
      hook: '',
      tone: '',
      examples: [{
        name: 'Example',
        content: content
      }],
      detectedVariables: detectedVariables
    };
    try {
      await saveContentSetup({
        id: newTemplate.id,
        name: newTemplate.name,
        configuration: {},
        examples: newTemplate.examples,
        isTemplate: true
      });
      setSavedSetups(prev => [...prev, newTemplate]);
      toast({
        title: "Template Saved",
        description: `Template "${name}" has been saved with ${detectedVariables.length} detected variables`
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template to database",
        variant: "destructive"
      });
    }
  };
  const handleTemplateContentGenerated = async (content: string) => {
    setShowTemplateDialog(false);
    if (!threadId) {
      toast({
        title: "Error",
        description: "No active chat thread",
        variant: "destructive"
      });
      return;
    }
    await sendMessage(content, threadId, "TEMPLATE");
    toast({
      title: "Content Generated",
      description: "Your content has been created from the template"
    });
  };
  const handleQuickAction = async (action: string) => {
    const isAnalyze = action === 'analyze';
    const isTemplate = action === 'template';
    const actionText = isAnalyze ? "Analyze viral posts" : isTemplate ? "Use a content template" : "Create a content draft";

    // Select the appropriate prompt type for each action
    const promptType = isAnalyze ? "QUICK_ANALYZE" : isTemplate ? "QUICK_TEMPLATE" : "QUICK_CREATE";
    let activeThreadId = threadId;
    if (!activeThreadId) {
      try {
        activeThreadId = await createThread(actionText);
        navigate(`/dashboard/chat/${activeThreadId}`);
      } catch (error) {
        console.error("Error creating thread:", error);
        toast({
          title: "Error",
          description: "Failed to create a new chat thread",
          variant: "destructive"
        });
        return;
      }
    }

    // Send the message with our specialized prompt type
    await sendMessage(actionText, activeThreadId, promptType);
    if (isAnalyze) {
      handleStartAnalyze();
    } else if (isTemplate) {
      handleStartTemplate();
    } else {
      handleStartContentCreation();
    }
  };
  const handleStartTemplate = () => {
    setShowTemplateDialog(true);
    ensureExclusiveUIState('none');
  };
  const handleStartAnalyze = () => {
    setChatMode("analyze_posts");
    setStep("collecting");
    ensureExclusiveUIState('analyze');
  };
  const handleStartContentCreation = () => {
    setChatMode("create_content");
    setStep("collecting");
    ensureExclusiveUIState('content');
  };
  const handleAnalyzePosts = async (posts: Post[]) => {
    ensureExclusiveUIState('none');
    setIsAnalyzing(true);
    if (!threadId) {
      toast({
        title: "Error",
        description: "No active chat thread",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      return;
    }
    try {
      await handleAnalyzeContent(posts, threadId);
      setShowAnalysisResults(true);
    } catch (error) {
      console.error("Error analyzing posts:", error);
      toast({
        title: "Error",
        description: "Failed to analyze posts",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleContentGenerate = async (data: any) => {
    setContentFormData(data);
    ensureExclusiveUIState('none');
    if (!threadId) {
      toast({
        title: "Error",
        description: "No active chat thread",
        variant: "destructive"
      });
      return;
    }
    try {
      const generatedContent = await handleCreateContent(data, threadId);
      if (generatedContent) {
        setGeneratedContent(generatedContent);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      });
    }
  };
  const handleEditContent = () => {
    setIsEditingContent(true);
    ensureExclusiveUIState('content');
  };
  const handleUseExactFormat = () => {
    setShowAnalysisResults(false);
    ensureExclusiveUIState('content');
  };
  const handleCreateSimilarContent = () => {
    setShowAnalysisResults(false);
    ensureExclusiveUIState('content');
  };
  const handleSaveContentSetup = (name: string) => {
    const newSetup: ContextContentSetup = {
      id: `setup-${Date.now()}`,
      name,
      configuration: {
        goal: contentFormData?.goal || "",
        format: contentFormData?.format || "",
        hook: contentFormData?.hook || "",
        tone: contentFormData?.tone || ""
      },
      examples: contentFormData?.examples ? contentFormData.examples.map(({
        name,
        content
      }: {
        name: string;
        content: string;
      }) => ({
        name,
        content
      })) : []
    };
    toast({
      title: "Setup Saved",
      description: `"${name}" has been saved to your setups`
    });
  };
  const addAccountTag = () => {
    if (tempAccountTag.trim()) {
      const handle = tempAccountTag.trim().replace(/\s+/g, '').toLowerCase();
      const display = tempAccountTag.trim();
      setAccountTags([...accountTags, {
        handle,
        display
      }]);
      setTempAccountTag("");
      setActiveQuickAction(null);
    }
  };
  const addContentTag = () => {
    if (tempContentTag.trim()) {
      const isLink = tempContentTag.trim().startsWith('http');
      setContentTags([...contentTags, {
        type: isLink ? 'link' : 'post',
        content: tempContentTag.trim()
      }]);
      setTempContentTag("");
      setActiveQuickAction(null);
    }
  };
  const removeAccountTag = (index: number) => {
    const newTags = [...accountTags];
    newTags.splice(index, 1);
    setAccountTags(newTags);
  };
  const removeContentTag = (index: number) => {
    const newTags = [...contentTags];
    newTags.splice(index, 1);
    setContentTags(newTags);
  };
  const renderActiveCard = () => {
    if (showTemplateDialog) {
      return <div className="my-4">
          <TemplateDialog onClose={() => setShowTemplateDialog(false)} onGenerate={handleTemplateContentGenerated} savedTemplates={savedSetups.filter(setup => setup.isTemplate === true)} onSaveTemplate={template => {
          if (handleSaveContentSetup) {
            handleSaveContentSetup(template.name);
          }
        }} />
        </div>;
    }
    if (showContentCard) {
      return <div className="my-4">
          <ContentCreationCard onClose={() => {
          setShowContentCard(false);
          if (isEditingContent) {
            setIsEditingContent(false);
          }
        }} onGenerate={handleContentGenerate} initialData={isEditingContent ? generatedContent || undefined : undefined} isEditing={isEditingContent} savedSetups={savedSetups} onSaveSetup={handleSaveContentSetup} />
        </div>;
    }
    if (showAnalyzeCard) {
      return <div className="my-4">
          <PostAnalyzeCard onClose={() => setShowAnalyzeCard(false)} onAnalyze={handleAnalyzePosts} />
        </div>;
    }
    return null;
  };
  return <PageContainer className="h-full flex flex-col animate-fade-in">
      <CardContainer className="flex-1 flex flex-col p-0 overflow-hidden" transparent>
        {showEmptyState ? <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-blue-400 mb-6">
              <Sparkles className="h-14 w-14 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">What can I help with?</h2>
            <p className="text-base text-white/70 max-w-lg mb-8">Choose a starting point below. I’ll help you analyze, 
create, or repurpose content.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto px-4 mb-16">
              <Button variant="outline" className="flex flex-col items-start w-full h-[100px] px-4 py-3 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-2xl transition-colors text-left group" onClick={() => handleQuickAction('analyze')}>
                <div className="flex items-center gap-2 w-full mb-0.5">
                  <span className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                    <AtSign className="h-4 w-4" />
                  </span>
                  <span className="text-[15px] font-semibold text-white">Analyze viral posts</span>
                </div>
                <p className="text-[12px] text-[#71767B] leading-[1.4] pl-[38px]">
                  Discover trends & patterns in<br />high-performing content
                </p>
              </Button>
              
              <Button variant="outline" className="flex flex-col items-start w-full h-[100px] px-4 py-3 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-2xl transition-colors text-left group" onClick={() => handleQuickAction('create')}>
                <div className="flex items-center gap-2 w-full mb-0.5">
                  <span className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="text-[15px] font-semibold text-white">Create content</span>
                </div>
                <p className="text-[12px] text-[#71767B] leading-[1.4] pl-[38px]">
                  Generate customized posts<br />optimized for engagement
                </p>
              </Button>

              <Button variant="outline" className="flex flex-col items-start w-full h-[100px] px-4 py-3 bg-[#18191B]/80 hover:bg-[#1C1D20]/90 border border-[#2A2B32] rounded-2xl transition-colors text-left group" onClick={() => handleQuickAction('template')}>
                <div className="flex items-center gap-2 w-full mb-0.5">
                  <span className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                    <FileCode className="h-4 w-4" />
                  </span>
                  <span className="text-[15px] font-semibold text-white">Use a template</span>
                </div>
                <p className="text-[12px] text-[#71767B] leading-[1.4] pl-[38px]">
                  Extract or use existing<br />content templates
                </p>
              </Button>
            </div>
            
            <div className="w-full max-w-3xl mx-auto px-4">
              <form onSubmit={handleSendMessage} className="relative flex items-center w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    
                  </PopoverTrigger>
                  
                  <PopoverContent side="top" className="w-64 p-2 bg-black/90 rounded-xl border border-white/10">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5" onClick={() => setActiveQuickAction('account')}>
                        <AtSign className="h-5 w-5 mr-2" />
                        Add Account
                      </Button>
                      <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5" onClick={() => setActiveQuickAction('content')}>
                        <FileText className="h-5 w-5 mr-2" />
                        Add Post
                      </Button>
                      <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5">
                        <FileCode className="h-5 w-5 mr-2" />
                        Add Template
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {activeQuickAction === 'account' && <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 border border-white/10 rounded-xl p-3 z-10">
                    <div className="flex items-center">
                      <AtSign className="h-5 w-5 mr-2 text-blue-400" />
                      <Input autoFocus placeholder="Enter account name (e.g., Elon Musk)" value={tempAccountTag} onChange={e => setTempAccountTag(e.target.value)} className="bg-white/5 border-white/10 rounded-lg text-base h-11" onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAccountTag();
                  }
                }} />
                      <Button type="button" className="ml-2 rounded-lg h-11 text-base" onClick={addAccountTag}>
                        Add
                      </Button>
                    </div>
                  </div>}
                
                {activeQuickAction === 'content' && <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 border border-white/10 rounded-xl p-3 z-10">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-400" />
                      <Input autoFocus placeholder="Add post content or link" value={tempContentTag} onChange={e => setTempContentTag(e.target.value)} className="bg-white/5 border-white/10 rounded-lg text-base h-11" onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addContentTag();
                  }
                }} />
                      <Button type="button" className="ml-2 rounded-lg h-11 text-base" onClick={addContentTag}>
                        Add
                      </Button>
                    </div>
                  </div>}
                
                <div className="relative flex-1 flex flex-col rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="flex-1 relative">
                    <Textarea className="bg-transparent text-white pl-5 pr-5 py-4 min-h-[52px] resize-none w-full max-h-[160px] overflow-y-auto border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]" placeholder="Type your message" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (e.shiftKey) {
                      // Shift+Enter adds a new line
                      return;
                    } else {
                      // Enter sends the message
                      e.preventDefault();
                      if (inputValue.trim() || accountTags.length > 0 || contentTags.length > 0) {
                        handleSendMessage(e);
                      }
                    }
                  }
                }} style={{
                  height: 'auto',
                  scrollbarWidth: 'thin',
                  /* Firefox */
                  scrollbarColor: '#1e40af transparent' /* Firefox */
                }} ref={textarea => {
                  if (textarea) {
                    // Auto-resize the textarea based on content
                    textarea.style.height = 'auto';
                    const newHeight = Math.min(160, Math.max(52, textarea.scrollHeight));
                    textarea.style.height = `${newHeight}px`;

                    // Add webkit scrollbar styles
                    textarea.style.cssText += `
                            ::-webkit-scrollbar { width: 4px; }
                            ::-webkit-scrollbar-track { background: transparent; }
                            ::-webkit-scrollbar-thumb { background-color: #1e40af; border-radius: 20px; }
                          `;
                  }
                }} />
                  </div>
                  <div className="h-12 flex justify-end items-center px-3">
                    <Button type="submit" className="h-9 w-9 p-0 rounded-full bg-blue-600 hover:bg-blue-500" size="icon" disabled={!inputValue.trim() && accountTags.length === 0 && contentTags.length === 0}>
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div> : <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-4 flex flex-col items-center">
                <div className="w-full max-w-3xl">
                  {contextMessages.map(message => <div key={message.id} className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender === 'assistant' && <Avatar className="h-9 w-9 mr-3 flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.8733 3.44469C12.2502 2.7947 13.1766 3.0615 13.225 3.8143L13.266 4.48217C13.3007 5.0447 13.8251 5.43853 14.3728 5.27853L15.0029 5.0908C15.7296 4.8818 16.2772 5.67372 15.8518 6.28105L15.4896 6.8076C15.1722 7.25702 15.3061 7.8576 15.7849 8.12964L16.3621 8.45305C17.0037 8.8261 16.847 9.77126 16.1236 9.90459L15.4661 10.0252C14.9161 10.1272 14.5498 10.655 14.6542 11.2044L14.7747 11.8448C14.9119 12.5676 14.0696 13.0772 13.4908 12.6591L12.9687 12.2824C12.5185 11.9543 11.8982 12.056 11.5826 12.5267L11.2173 13.0725C10.8098 13.6802 9.84862 13.4133 9.80021 12.6605L9.75925 11.9926C9.72448 11.4301 9.20013 11.0363 8.65242 11.1963L8.02232 11.384C7.29561 11.593 6.74799 10.8011 7.17337 10.1938L7.53559 9.66722C7.85302 9.21781 7.71911 8.61723 7.24025 8.34519L6.66311 8.02178C6.02152 7.64873 6.17818 6.70356 6.90158 6.57023L7.55908 6.44962C8.10911 6.34757 8.47538 5.81983 8.37098 5.27038L8.25047 4.62998C8.11325 3.90717 8.95554 3.39761 9.53432 3.81569L10.0564 4.19245C10.5066 4.52055 11.127 4.41887 11.4426 3.94816L11.8733 3.44469Z" fill="#3B82F6" />
                              <path d="M14.9177 15.56C15.1577 15.1817 15.7253 15.339 15.7563 15.7868L15.7833 16.1799C15.8065 16.516 16.1197 16.757 16.4471 16.6583L16.8351 16.5386C17.2529 16.4105 17.5938 16.8972 17.3276 17.255L17.1082 17.5485C16.904 17.83 16.9864 18.2142 17.2877 18.3814L17.647 18.5846C18.0496 18.8158 17.9528 19.3916 17.4898 19.4716L17.1049 19.543C16.7705 19.6067 16.5384 19.9232 16.6039 20.2571L16.682 20.6411C16.7687 21.104 16.2496 21.4182 15.8956 21.1706L15.5846 20.9583C15.3002 20.7662 14.9227 20.8286 14.7237 21.101L14.4915 21.4141C14.2314 21.7762 13.6638 21.6189 13.6328 21.1711L13.6058 20.778C13.5826 20.4419 13.2694 20.2009 12.942 20.2996L12.554 20.4193C12.1362 20.5474 11.7953 20.0607 12.0615 19.7029L12.2809 19.4094C12.4851 19.1279 12.4027 18.7437 12.1014 18.5765L11.7422 18.3733C11.3395 18.1421 11.4363 17.5663 11.8993 17.4863L12.2842 17.4149C12.6186 17.3512 12.8508 17.0347 12.7852 16.7008L12.7072 16.3168C12.6204 15.8539 13.1395 15.5397 13.4936 15.7873L13.8045 15.9996C14.0889 16.1917 14.4664 16.1293 14.6654 15.8569L14.9177 15.56Z" fill="#3B82F6" />
                              <path d="M6.79117 14.9556C6.97559 14.7712 7.24199 14.8282 7.35464 15.0471L7.45405 15.2386C7.53693 15.3997 7.74171 15.4578 7.90235 15.3688L8.09388 15.2582C8.31229 15.1369 8.56254 15.303 8.52053 15.5398L8.48331 15.7467C8.45203 15.9266 8.56468 16.1064 8.74425 16.1622L8.95933 16.2303C9.19159 16.3037 9.22875 16.6155 9.01517 16.7259L8.82846 16.8254C8.66741 16.9092 8.58937 17.1132 8.64285 17.2743L8.70118 17.4552C8.77232 17.6727 8.53722 17.8698 8.31397 17.7741L8.12726 17.6918C7.95097 17.6171 7.75104 17.6903 7.65649 17.8566L7.54736 18.0432C7.42526 18.2556 7.15404 18.1987 7.04139 17.9798L6.94198 17.7882C6.85911 17.6271 6.65433 17.569 6.49368 17.6581L6.30215 17.7687C6.08374 17.89 5.83349 17.7238 5.8755 17.4871L5.91273 17.2801C5.944 17.1003 5.83136 16.9205 5.65178 16.8647L5.4367 16.7966C5.20444 16.7232 5.16728 16.4113 5.38086 16.301L5.56758 16.2015C5.72862 16.1177 5.80667 15.9137 5.75318 15.7526L5.69485 15.5716C5.62371 15.3542 5.85881 15.1571 6.08207 15.2528L6.26878 15.3351C6.44506 15.4098 6.64499 15.3366 6.73954 15.1703L6.79117 14.9556Z" fill="#3B82F6" />
                            </svg>
                          </div>
                        </Avatar>}
                      
                      <div className={`max-w-[80%] rounded-xl p-4 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1A1F2C] text-white/90 border border-white/10'}`}>
                        {message.icon && <div className="flex items-center gap-3 w-full mb-1">
                            {message.icon}
                            <span className="ml-2 font-medium text-base">{message.text}</span>
                          </div>}

                        {!message.icon && message.sender === 'user' ? <UserMessageContent content={message.text} /> : !message.icon && !message.isTyping ? <AssistantMessageContent content={message.text} /> : !message.icon && <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                              {message.text}
                            </div>}
                        
                        {message.isTyping && <div className="mt-1 flex items-center space-x-1">
                            <span className="text-xs text-white/70">typing</span>
                            <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{
                      animationDelay: "0.2s"
                    }}></div>
                            <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{
                      animationDelay: "0.4s"
                    }}></div>
                          </div>}

                        {message.contentPreview && <div className="mt-4">
                            <ContentPreviewCard title={message.contentPreview.title} content={message.contentPreview.content} examples={message.contentPreview.examples} goal={message.contentPreview.goal} format={message.contentPreview.format} hook={message.contentPreview.hook} tone={message.contentPreview.tone} onEdit={handleEditContent} onSaveSetup={handleSaveContentSetup} />
                          </div>}

                        {message.analysisResult && message.analysisData && <div className="mt-4">
                            <PostAnalysisResult sections={message.analysisData} onUseFormat={handleUseExactFormat} onCreateSimilar={handleCreateSimilarContent} />
                          </div>}
                      </div>

                      {message.sender === 'user' && <Avatar className="h-9 w-9 ml-3 flex-shrink-0">
                          <div className="bg-gray-700 h-full w-full rounded-full flex items-center justify-center text-white">
                            U
                          </div>
                        </Avatar>}
                    </div>)}
                  
                  {contextIsTyping && !contextMessages.some(msg => msg.isTyping) && <div className="flex items-center text-sm text-white/50 mt-3 ml-12">
                      <span>AI is typing</span>
                      <div className="ml-2 flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{
                    animationDelay: "0.2s"
                  }}></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{
                    animationDelay: "0.4s"
                  }}></div>
                      </div>
                    </div>}
                  
                  {renderActiveCard()}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>}
        
        {(accountTags.length > 0 || contentTags.length > 0) && <div className="px-4 py-2 flex flex-wrap gap-2 justify-center">
            <div className="w-full max-w-3xl flex flex-wrap gap-2">
              {accountTags.map((tag, index) => <div key={`account-${index}`} className="bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-blue-400/20 text-base">
                  <AtSign className="h-4.5 w-4.5" />
                  <span>{tag.handle}</span>
                  <button className="ml-1.5 hover:text-white" onClick={() => removeAccountTag(index)}>
                    &times;
                  </button>
                </div>)}
              
              {contentTags.map((tag, index) => <div key={`content-${index}`} className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 border text-base ${tag.type === 'link' ? 'bg-blue-600/20 text-blue-400 border-blue-400/20' : 'bg-green-600/20 text-green-400 border-green-400/20'}`}>
                  {tag.type === 'link' ? <LinkIcon className="h-4.5 w-4.5" /> : <FileText className="h-4.5 w-4.5" />}
                  <span className="max-w-48 truncate">{tag.content}</span>
                  <button className="ml-1.5 hover:text-white" onClick={() => removeContentTag(index)}>
                    &times;
                  </button>
                </div>)}
            </div>
          </div>}
        
        {showSuggestionChips && <div className="px-4 flex justify-center mb-2">
            <div className="w-full max-w-3xl">
              <SuggestionChips suggestions={[{
            id: 'analyze',
            text: 'Analyze viral posts'
          }, {
            id: 'create',
            text: 'Create a content draft'
          }, {
            id: 'template',
            text: 'Use a template'
          }]} onChipClick={text => {
            if (text.includes('Analyze')) {
              handleQuickAction('analyze');
            } else if (text.includes('template')) {
              handleQuickAction('template');
            } else {
              handleQuickAction('create');
            }
          }} />
            </div>
          </div>}
        
        {!showEmptyState && <div className="p-4 flex justify-center">
            <form onSubmit={handleSendMessage} className="relative flex items-center w-full max-w-3xl">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" className="h-12 mr-3 px-3 rounded-md bg-white/5 hover:bg-white/10 border-white/10" variant="outline">
                    <Plus className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                
                <PopoverContent side="top" className="w-64 p-2 bg-black/90 rounded-xl border border-white/10">
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5" onClick={() => setActiveQuickAction('account')}>
                      <AtSign className="h-5 w-5 mr-2" />
                      Add Account
                    </Button>
                    <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5" onClick={() => setActiveQuickAction('content')}>
                      <FileText className="h-5 w-5 mr-2" />
                      Add Post
                    </Button>
                    <Button variant="ghost" className="justify-start rounded-lg text-base py-2.5">
                      <FileCode className="h-5 w-5 mr-2" />
                      Add Template
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {activeQuickAction === 'account' && <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 border border-white/10 rounded-xl p-3 z-10">
                  <div className="flex items-center">
                    <AtSign className="h-5 w-5 mr-2 text-blue-400" />
                    <Input autoFocus placeholder="Enter account name (e.g., Elon Musk)" value={tempAccountTag} onChange={e => setTempAccountTag(e.target.value)} className="bg-white/5 border-white/10 rounded-lg text-base h-11" onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAccountTag();
                }
              }} />
                    <Button type="button" className="ml-2 rounded-lg h-11 text-base" onClick={addAccountTag}>
                      Add
                    </Button>
                  </div>
                </div>}
              
              {activeQuickAction === 'content' && <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 border border-white/10 rounded-xl p-3 z-10">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    <Input autoFocus placeholder="Add post content or link" value={tempContentTag} onChange={e => setTempContentTag(e.target.value)} className="bg-white/5 border-white/10 rounded-lg text-base h-11" onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addContentTag();
                }
              }} />
                    <Button type="button" className="ml-2 rounded-lg h-11 text-base" onClick={addContentTag}>
                      Add
                    </Button>
                  </div>
                </div>}
              
              <div className="relative flex-1 flex flex-col rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex-1 relative">
                  <Textarea className="bg-transparent text-white pl-5 pr-5 py-4 min-h-[52px] resize-none w-full max-h-[160px] overflow-y-auto border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]" placeholder="Type your message" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) {
                    // Shift+Enter adds a new line
                    return;
                  } else {
                    // Enter sends the message
                    e.preventDefault();
                    if (inputValue.trim() || accountTags.length > 0 || contentTags.length > 0) {
                      handleSendMessage(e);
                    }
                  }
                }
              }} style={{
                height: 'auto',
                scrollbarWidth: 'thin',
                /* Firefox */
                scrollbarColor: '#1e40af transparent' /* Firefox */
              }} ref={textarea => {
                if (textarea) {
                  // Auto-resize the textarea based on content
                  textarea.style.height = 'auto';
                  const newHeight = Math.min(160, Math.max(52, textarea.scrollHeight));
                  textarea.style.height = `${newHeight}px`;

                  // Add webkit scrollbar styles
                  textarea.style.cssText += `
                          ::-webkit-scrollbar { width: 4px; }
                          ::-webkit-scrollbar-track { background: transparent; }
                          ::-webkit-scrollbar-thumb { background-color: #1e40af; border-radius: 20px; }
                        `;
                }
              }} />
                </div>
                <div className="h-12 flex justify-end items-center px-3">
                  <Button type="submit" className="h-9 w-9 p-0 rounded-full bg-blue-600 hover:bg-blue-500" size="icon" disabled={!inputValue.trim() && accountTags.length === 0 && contentTags.length === 0}>
                    <SendHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </form>
          </div>}
      </CardContainer>
    </PageContainer>;
};
export default ChatInterface;