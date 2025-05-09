import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BookmarkCheck, ChevronRight, MessageSquare, Heart, Repeat, Share2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample data - this would come from an API in a real application
const CREATOR_DATA = {
  "1": {
    name: "Naval Ravikant",
    handle: "@naval",
    avatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    followers: "1.9M",
    category: "Tech",
    summary: "Concise philosophical insights on wealth, health and happiness.",
    description: "Naval Ravikant is an Indian-American entrepreneur and investor. He is the co-founder, chairman and former CEO of AngelList. He has invested in more than 100 companies including Uber, FourSquare, Twitter, and many others.",
    tone: ["Thoughtful", "Direct", "Philosophical"],
    writingStyle: "Concise sentences. Philosophical concepts. Occasional thread format with numbered insights.",
    contentTopics: ["Wealth creation", "Happiness", "Reading", "Mental models", "Technology"]
  },
  "2": {
    name: "Pieter Levels",
    handle: "@levelsio",
    avatar: "https://pbs.twimg.com/profile_images/1560843221928894464/zWrUjorg_400x400.jpg",
    followers: "236K",
    category: "Tech",
    summary: "Indie maker building in public. Transparent business metrics and startup insights.",
    description: "Pieter Levels is a Dutch entrepreneur who builds startups in public. He's the founder of Nomad List and Remote OK and is known for his transparent approach to business.",
    tone: ["Casual", "Direct", "Informative"],
    writingStyle: "Casual tone. Screenshots of metrics. Transparent about numbers. Short to medium length posts.",
    contentTopics: ["Startups", "Remote work", "Bootstrapping", "Digital nomad lifestyle", "Building in public"]
  }
};

// Sample posts
const POSTS_DATA = {
  "1": [
    {
      id: "p1",
      text: "Reading is faster than listening. Doing is faster than watching.",
      engagement: { likes: 12568, retweets: 1852, replies: 158 },
      date: "2023-06-15"
    },
    {
      id: "p2",
      text: "The most important skill for getting rich is becoming a perpetual learner.\n\nThe older you get, the more you realize that everything is still up for grabs.",
      engagement: { likes: 8721, retweets: 1245, replies: 85 },
      date: "2023-05-22"
    },
    {
      id: "p3",
      text: "All the benefits in life come from compound interest — money, relationships, habits — anything of value.",
      engagement: { likes: 15340, retweets: 2751, replies: 132 },
      date: "2023-04-18"
    }
  ],
  "2": [
    {
      id: "p1",
      text: "Just hit $102,392.20 MRR with my no-code side projects across @nomadlist and @remoteok! Bootstrapped, solo founder, no investors, no loans, no debt, remote company.",
      engagement: { likes: 5632, retweets: 421, replies: 189 },
      date: "2023-06-18"
    },
    {
      id: "p2",
      text: "When I had a job I hated Mondays. Now I love Mondays because I can continue building my own ideas.",
      engagement: { likes: 3249, retweets: 315, replies: 42 },
      date: "2023-05-28"
    }
  ]
};

const CreatorDetailPage: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  
  // Get creator data based on ID from URL param
  const creator = creatorId ? CREATOR_DATA[creatorId as keyof typeof CREATOR_DATA] : null;
  const posts = creatorId ? POSTS_DATA[creatorId as keyof typeof POSTS_DATA] : [];
  
  if (!creator) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">Creator not found</h2>
          <Button onClick={() => navigate("/dashboard/library")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleSavePost = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      {/* Back navigation */}
      <div className="border-b border-white/10 bg-background sticky top-0 z-10">
        <PageContainer className="py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard/library")}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Library
            </Button>
          </div>
        </PageContainer>
      </div>
      
      <PageContainer className="py-6 flex flex-col flex-grow overflow-hidden">
        {/* Creator profile */}
        <CardContainer className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-20 w-20 rounded-full border border-white/10">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
                <span className="text-white/60">{creator.handle}</span>
                <Badge className="bg-primary-400/20 text-primary-400 border-none">
                  {creator.followers} followers
                </Badge>
              </div>
              
              <p className="text-white/80 mb-3">{creator.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-black/30 text-white/80 border-white/10">
                  {creator.category}
                </Badge>
                {creator.tone.map((tone, i) => (
                  <Badge key={i} variant="secondary" className="bg-white/10 text-white/80 border-none">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 md:self-start">
              <Button className="bg-primary-500 hover:bg-primary-600">
                Use This Style
              </Button>
              <Button variant="outline" className="bg-transparent">
                Save to Folder
              </Button>
            </div>
          </div>
        </CardContainer>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="bg-black/20 border border-white/10 p-1 w-full mb-6">
            <TabsTrigger value="posts" className="flex-1">Top Posts</TabsTrigger>
            <TabsTrigger value="style" className="flex-1">Writing Style</TabsTrigger>
            <TabsTrigger value="topics" className="flex-1">Content Topics</TabsTrigger>
          </TabsList>
          
          {/* Top Posts Tab */}
          <TabsContent value="posts" className="flex-grow overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 pb-10">
                {posts.map((post) => (
                  <CardContainer key={post.id} className="hover:bg-black/30 transition-all">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-9 w-9 border border-white/10">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{creator.name}</span>
                              <span className="text-white/60 text-sm">{creator.handle}</span>
                            </div>
                            <p className="text-white/60 text-xs">
                              {new Date(post.date).toLocaleDateString('en-US', { 
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full ${savedPosts.includes(post.id) ? 'text-primary-400' : 'text-white/60'}`}
                          onClick={() => handleSavePost(post.id)}
                        >
                          <BookmarkCheck className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-3 text-white whitespace-pre-line">
                        {post.text}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-white/60 text-sm pt-2 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{formatNumber(post.engagement.replies)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Repeat className="h-4 w-4" />
                            <span>{formatNumber(post.engagement.retweets)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{formatNumber(post.engagement.likes)}</span>
                          </div>
                        </div>
                        <div>
                          <Share2 className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContainer>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Writing Style Tab */}
          <TabsContent value="style" className="m-0 flex-grow overflow-auto">
            <CardContainer className="mb-6">
              <h3 className="text-lg font-medium mb-3">Writing Style Analysis</h3>
              <p className="text-white/80 whitespace-pre-line mb-4">{creator.writingStyle}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium mb-2">Hook Types</h4>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    <li>Contrarian statements</li>
                    <li>Philosophical questions</li>
                    <li>Counterintuitive observations</li>
                    <li>Direct advice statements</li>
                  </ul>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium mb-2">Structure Patterns</h4>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    <li>Short, impactful sentences</li>
                    <li>Occasional numbered lists</li>
                    <li>Threads with building ideas</li>
                    <li>Consistent use of white space</li>
                  </ul>
                </div>
              </div>
            </CardContainer>
            
            <CardContainer>
              <h3 className="text-lg font-medium mb-3">Language Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Sentence Structure</h4>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="text-white/70">
                      Primarily uses short, direct sentences. Avoids complex structures. 
                      Occasionally uses sentence fragments for emphasis. Average sentence 
                      length: 8-12 words.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Vocabulary</h4>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="text-white/70">
                      Precise word choice. Avoids unnecessary jargon. Uses accessible language 
                      to explain complex concepts. Rarely uses excessive adjectives.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Rhetorical Devices</h4>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="text-white/70">
                      Frequently uses paradox, aphorism, and juxtaposition. Employs metaphors 
                      sparingly but effectively. Often presents ideas as universal truths. Uses 
                      repetition for emphasis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContainer>
          </TabsContent>
          
          {/* Content Topics Tab */}
          <TabsContent value="topics" className="m-0 flex-grow overflow-auto">
            <CardContainer className="mb-6">
              <h3 className="text-lg font-medium mb-3">Main Content Themes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {creator.contentTopics.map((topic, i) => (
                  <div 
                    key={i} 
                    className="bg-black/30 border border-white/10 rounded-lg p-3 flex items-center justify-center text-center"
                  >
                    <span className="text-white/80">{topic}</span>
                  </div>
                ))}
              </div>
            </CardContainer>
            
            <CardContainer>
              <h3 className="text-lg font-medium mb-3">Topic Analysis</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Content Distribution</h4>
                  </div>
                  <div className="bg-black/20 h-14 rounded-lg border border-white/10 overflow-hidden flex">
                    <div className="bg-primary-400/80 h-full" style={{ width: '35%' }} title="Wealth creation: 35%"></div>
                    <div className="bg-primary-400/60 h-full" style={{ width: '25%' }} title="Happiness: 25%"></div>
                    <div className="bg-primary-400/40 h-full" style={{ width: '20%' }} title="Reading & Learning: 20%"></div>
                    <div className="bg-primary-400/30 h-full" style={{ width: '15%' }} title="Mental models: 15%"></div>
                    <div className="bg-primary-400/20 h-full" style={{ width: '5%' }} title="Technology: 5%"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/60">
                    <span>Wealth creation (35%)</span>
                    <span>Happiness (25%)</span>
                    <span>Other (40%)</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Common Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {['#wealth', '#happiness', '#reading', '#philosophy', '#technology', '#business'].map((tag, i) => (
                      <Badge key={i} className="bg-black/30 border-white/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Content Strategy</h4>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="text-white/70">
                      Focuses on timeless wisdom rather than current events. Rarely posts about 
                      personal life. Maintains consistent themes across posts. Publishes threads 
                      for complex topics. Uses single tweets for aphorisms and observations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default CreatorDetailPage;
