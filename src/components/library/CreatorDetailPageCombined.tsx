
import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Twitter, 
  BarChart3, 
  BookOpen, 
  PieChart, 
  CheckCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardContainer } from '@/components/ui/card-container';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Example Twitter post data
const EXAMPLE_POSTS = [
  {
    id: 'post1',
    content: "You only need one yes. I rewrote my story 107 times to get it.",
    likes: 2457,
    replies: 128,
    retweets: 532,
    engagement: "4.8%",
    date: "2023-10-12"
  },
  {
    id: 'post2',
    content: "Success comes slow (but failure comes fast)\n\nFeedback stings (but you grow with every mistake)",
    likes: 1843,
    replies: 76,
    retweets: 421,
    engagement: "3.9%",
    date: "2023-09-28"
  },
  {
    id: 'post3',
    content: "I learned to:\n• Listen to users (even when it hurts)\n• Move fast (even when you feel lost)\n• Celebrate small wins (they keep you going)",
    likes: 3254,
    replies: 143,
    retweets: 876,
    engagement: "5.2%",
    date: "2023-09-05"
  }
];

interface ContentTopic {
  topic: string;
  percentage: number;
  color: string;
}

// Topic data
const CONTENT_TOPICS: ContentTopic[] = [
  { topic: "Personal Growth", percentage: 40, color: "#4a72f5" },
  { topic: "Startups", percentage: 25, color: "#36b37e" },
  { topic: "Philosophy", percentage: 20, color: "#ffab00" },
  { topic: "Technology", percentage: 15, color: "#ff5630" }
];

// Writing patterns data
const WRITING_PATTERNS = [
  { pattern: "Uses short, punchy sentences", examples: 18 },
  { pattern: "Starts threads with a hook/question", examples: 12 },
  { pattern: "Employs numbered lists", examples: 9 },
  { pattern: "Includes personal anecdotes", examples: 7 },
  { pattern: "Uses contrast (but/yet/however)", examples: 14 }
];

interface CreatorDetailPageCombinedProps {
  creator?: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    followers: string;
    category: string;
    summary: string;
    tone: string;
  };
  onBack: () => void;
}

const CreatorDetailPageCombined: React.FC<CreatorDetailPageCombinedProps> = ({ 
  creator = {
    id: "1",
    name: "Naval Ravikant",
    handle: "@naval",
    avatar: "https://pbs.twimg.com/profile_images/1256841238298292232/ycqwaMI2_400x400.jpg",
    followers: "1.9M",
    category: "Tech",
    summary: "Concise philosophical insights on wealth, health and happiness.",
    tone: "Thoughtful, Direct, Philosophical"
  }, 
  onBack 
}) => {
  const [isStyleSelected, setIsStyleSelected] = useState(false);

  const handleUseStyle = () => {
    setIsStyleSelected(!isStyleSelected);
    if (!isStyleSelected) {
      // Toast or notification logic would go here
      console.log(`Selected ${creator.name}'s style`);
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-[var(--primary-bg)] overflow-hidden">
      {/* Creator profile header */}
      <div className="p-4 md:p-6 bg-[var(--secondary-bg)] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 md:h-16 md:w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="bg-[var(--accent-blue)]">
              {creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">{creator.name}</h1>
              <Badge variant="outline" className="bg-[var(--tertiary-bg)] text-white/70 border-none">
                {creator.category}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-white/70 text-sm">{creator.handle}</p>
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <Users className="h-3 w-3" />
                {creator.followers} followers
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky CTA button */}
        <Button 
          onClick={handleUseStyle}
          className={`${
            isStyleSelected 
              ? "bg-[var(--tertiary-bg)] text-[var(--accent-blue)] border border-[var(--accent-blue)]" 
              : "bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white"
          } px-6 rounded-full shadow-md`}
        >
          {isStyleSelected ? 
            <><CheckCircle className="h-4 w-4 mr-2" /> Style Selected</> : 
            <><ArrowUpRight className="h-4 w-4 mr-2" /> Use this Style</>
          }
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Creator summary */}
          <div className="mb-8">
            <div className="bg-[var(--secondary-bg)] p-4 rounded-lg border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-2">Creator Summary</h2>
              <p className="text-white/80">{creator.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {creator.tone.split(', ').map((tone, index) => (
                  <Badge key={index} variant="secondary" className="bg-[var(--tertiary-bg)] text-white/80">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Top Posts Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Twitter className="h-5 w-5 text-[var(--accent-blue)]" />
              Top Posts
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {EXAMPLE_POSTS.map(post => (
                <CardContainer key={post.id} className="bg-[var(--secondary-bg)] border-white/10 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback className="bg-[var(--accent-blue)]">
                        {creator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-white">{creator.name}</p>
                          <p className="text-white/60 text-sm">{creator.handle}</p>
                        </div>
                        <span className="text-white/40 text-sm">{post.date}</span>
                      </div>
                      <div className="mt-2 whitespace-pre-line text-white/90">
                        {post.content}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-white/60 text-sm">
                        <span>❤️ {post.likes}</span>
                        <span>🔄 {post.retweets}</span>
                        <span>💬 {post.replies}</span>
                        <span>⚡ {post.engagement} engagement</span>
                      </div>
                    </div>
                  </div>
                </CardContainer>
              ))}
            </div>
          </section>

          {/* Writing Patterns Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-[var(--accent-blue)]" />
              Writing Patterns
            </h2>
            
            <CardContainer className="bg-[var(--secondary-bg)] border-white/10 p-4">
              <div className="space-y-4">
                {WRITING_PATTERNS.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[var(--tertiary-bg)] rounded-full h-8 w-8 flex items-center justify-center text-white/80">
                        {index + 1}
                      </div>
                      <span className="text-white/80">{pattern.pattern}</span>
                    </div>
                    <Badge variant="outline" className="bg-[var(--tertiary-bg)] text-white/70 border-none">
                      {pattern.examples} examples
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContainer>
          </section>

          {/* Content Topics Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[var(--accent-blue)]" />
              Content Strategy & Topics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardContainer className="bg-[var(--secondary-bg)] border-white/10 p-4">
                <h3 className="text-lg font-medium text-white mb-3">Topic Distribution</h3>
                <div className="space-y-3">
                  {CONTENT_TOPICS.map((topic, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{topic.topic}</span>
                        <span className="text-white/60">{topic.percentage}%</span>
                      </div>
                      <div className="h-2 bg-[var(--tertiary-bg)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${topic.percentage}%`,
                            backgroundColor: topic.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContainer>
              
              <CardContainer className="bg-[var(--secondary-bg)] border-white/10 p-4">
                <h3 className="text-lg font-medium text-white mb-3">Content Strategy</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 text-[var(--accent-blue)] mt-0.5">•</div>
                    <span className="text-white/80">Focuses on actionable philosophy over abstract concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 text-[var(--accent-blue)] mt-0.5">•</div>
                    <span className="text-white/80">Repurposes key ideas across multiple posts with different angles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 text-[var(--accent-blue)] mt-0.5">•</div>
                    <span className="text-white/80">Builds multi-tweet threads around central themes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 text-[var(--accent-blue)] mt-0.5">•</div>
                    <span className="text-white/80">Publishes consistently but infrequently (quality over quantity)</span>
                  </li>
                </ul>
              </CardContainer>
            </div>
          </section>
          
          {/* Mobile sticky CTA - visible at bottom on smaller screens */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--secondary-bg)] border-t border-white/10">
            <Button
              onClick={handleUseStyle}
              className={`${
                isStyleSelected 
                  ? "bg-[var(--tertiary-bg)] text-[var(--accent-blue)] border border-[var(--accent-blue)]" 
                  : "bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white"
              } w-full py-6 rounded-md shadow-md`}
            >
              {isStyleSelected ? 
                <><CheckCircle className="h-4 w-4 mr-2" /> Style Selected</> : 
                <><ArrowUpRight className="h-4 w-4 mr-2" /> Use this Style</>
              }
            </Button>
          </div>
          
          {/* Bottom spacer for mobile to account for the fixed button */}
          <div className="md:hidden h-20"></div>
        </div>
      </ScrollArea>

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 text-white/70 hover:text-white"
        onClick={onBack}
      >
        ← Back
      </Button>
    </div>
  );
};

export default CreatorDetailPageCombined;
