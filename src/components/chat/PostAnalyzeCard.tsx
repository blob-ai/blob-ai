import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Search, BarChart2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Post = {
  id: string;
  url?: string;
  content: string;
};

interface PostAnalyzeCardProps {
  onClose: () => void;
  onAnalyze: (posts: Post[]) => void;
}

const PostAnalyzeCard: React.FC<PostAnalyzeCardProps> = ({
  onClose,
  onAnalyze,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostUrl, setNewPostUrl] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: `post-${Date.now()}`,
        url: newPostUrl.trim() || undefined,
        content: newPostContent.trim(),
      };
      setPosts([...posts, newPost]);
      setNewPostUrl("");
      setNewPostContent("");
      setIsAddingPost(false);
    }
  };

  const handleRemovePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleAnalyze = () => {
    onAnalyze(posts);
  };

  if (posts.length === 0 && !isAddingPost) {
    return (
      <div className="bg-[#121212] rounded-xl overflow-hidden w-full border border-white/10 font-sans">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-medium font-sans">Analyze Posts</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/70">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-[#60a5fa]" />
          </div>
          <h4 className="font-medium text-lg mb-2 font-sans">No posts to analyze</h4>
          <p className="text-white/60 mb-6 max-w-md font-sans">
            Add posts from Twitter/X to analyze their performance and identify patterns that drive engagement.
          </p>
          <Button 
            onClick={() => setIsAddingPost(true)}
            className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white rounded-xl font-sans"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Posts
          </Button>
        </div>
      </div>
    );
  }

  if (isAddingPost) {
    return (
      <div className="bg-[#121212] rounded-xl overflow-hidden w-full border border-white/10 font-sans">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-medium font-sans">Add Post</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAddingPost(false)} 
            className="h-8 w-8 text-white/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-1 font-sans">Post URL (optional)</label>
            <Input
              placeholder="https://twitter.com/username/status/123456789"
              value={newPostUrl}
              onChange={(e) => setNewPostUrl(e.target.value)}
              className="bg-[#1A1A1A] border-white/10 font-sans"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-1 font-sans">Post Content</label>
            <Textarea
              placeholder="Paste the content of the post here..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-24 bg-[#1A1A1A] border-white/10 resize-none font-sans"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddingPost(false)}
              className="text-[#60a5fa] hover:text-[#60a5fa]/80 font-sans"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPost}
              disabled={!newPostContent.trim()}
              className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white rounded-xl font-sans"
            >
              Add Post
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] rounded-xl overflow-hidden w-full border border-white/10 font-sans">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-lg font-medium font-sans">Posts to analyze ({posts.length})</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/70">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="max-h-[40vh]">
        <div className="p-4 space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1A1A1A] rounded-lg p-3 border border-white/5 relative">
              {post.url && (
                <div className="text-[#60a5fa] text-sm truncate mb-1 font-sans">{post.url}</div>
              )}
              <div className="text-sm line-clamp-2 font-sans">{post.content}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2"
                onClick={() => handleRemovePost(post.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 flex justify-between border-t border-white/10 bg-[#1A1A1A]">
        <Button 
          variant="ghost" 
          onClick={() => setIsAddingPost(true)}
          className="text-[#60a5fa] hover:bg-transparent hover:text-[#60a5fa]/80 font-sans"
        >
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
        <Button 
          onClick={handleAnalyze}
          className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white rounded-xl font-sans flex items-center gap-2"
        >
          <BarChart2 className="h-4 w-4" /> Analyze Posts
        </Button>
      </div>
    </div>
  );
};

export default PostAnalyzeCard;
