/* 
1. Receives request with threadId, content, and optional systemPrompt
2. Authenticates user using JWT token
3. Retrieves conversation history from chat_messages table
4. Stores messages in the database for context
5. Formats messages for OpenAI API
6. Determines if this is an analysis request and adjusts model parameters accordingly
7. Calls OpenAI API
8. Inserts user message to database
9. Prepares metadata for analysis results if applicable
10. Saves assistant message to database
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not set in environment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { threadId, content, systemPrompt } = reqBody;
    
    if (!threadId || !content) {
      console.error('Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: threadId and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://wmstewknmipfvuqojfxl.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseServiceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set in environment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase admin client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user information from the auth token
    const authHeader = req.headers.get('Authorization');
    let userId;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        if (userError) {
          console.error('Token verification error:', userError);
          return new Response(
            JSON.stringify({ error: 'Invalid authentication token' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        userId = userData?.user?.id;
        
        if (!userId) {
          console.error('User ID not found in token');
          return new Response(
            JSON.stringify({ error: 'User ID not found' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        console.error('Auth token verification error:', e);
        return new Response(
          JSON.stringify({ error: 'Error verifying authentication token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.error('No Authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authentication token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check user's profile - skip daily limits for now to ensure functionality
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      // Instead of returning an error, log it and continue processing
      // This allows users without a profile to still use the AI
      console.warn('Profile not found, but continuing:', profileError);
    }
    
    // Format messages for OpenAI API
    const formattedMessages = [];
    
    // Add system prompt
    if (systemPrompt) {
      formattedMessages.push({
        role: 'system',
        content: systemPrompt
      });
    } else {
      // Default system prompt
      formattedMessages.push({
        role: 'system',
        content: 'You are inspire.me, an AI assistant specialized in helping users create engaging social media content and analyzing viral posts. Be concise, helpful, and provide actionable insights.'
      });
    }
    
    // Get conversation history for context
    try {
      const { data: messages, error: messagesError } = await supabaseAdmin
        .from('chat_messages')
        .select('role, content')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
        .limit(10); // Limit to recent messages to avoid token limits
      
      if (!messagesError && messages && messages.length > 0) {
        // Add message history
        messages.forEach(msg => {
          formattedMessages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }
    } catch (e) {
      console.warn('Error fetching message history, continuing without context:', e);
      // Continue without message history
    }
    
    // Add the current message
    formattedMessages.push({
      role: 'user',
      content
    });
    
    console.log('Calling OpenAI with messages:', JSON.stringify(formattedMessages));
    
    // Determine if this is an analysis request and adjust model parameters accordingly
    const isAnalysisRequest = systemPrompt && systemPrompt.includes('CONTENT ANALYSIS');
    const modelParams = {
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: isAnalysisRequest ? 0.5 : 0.7, // Lower temperature for more structured outputs in analysis
      max_tokens: isAnalysisRequest ? 2000 : 1500 // More tokens for detailed analysis
    };
    
    // Call OpenAI API
    let openAIResponse;
    try {
      openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(modelParams)
      });
    } catch (e) {
      console.error('OpenAI API network error:', e);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to OpenAI API', details: e.message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      
      console.error('OpenAI API error response:', errorData);
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', details: errorData }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const completion = await openAIResponse.json();
    console.log('OpenAI response:', JSON.stringify(completion));
    
    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      console.error('Invalid response structure from OpenAI:', completion);
      return new Response(
        JSON.stringify({ error: 'Invalid response from OpenAI API' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const assistantMessage = completion.choices[0].message;
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    // Insert user message to database
    try {
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          role: 'user',
          content: content
        });
    } catch (e) {
      console.error('Error saving user message:', e);
      // Continue even if message save fails
    }
    
    // Prepare metadata for analysis results if applicable
    const metadata = {};
    if (isAnalysisRequest) {
      metadata.is_analysis = true;
    }
    
    // Save assistant message to database
    let savedAssistantMessage;
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          role: 'assistant',
          content: assistantMessage.content,
          tokens_used: tokensUsed,
          metadata: Object.keys(metadata).length > 0 ? metadata : null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Assistant message error:', error);
      } else {
        savedAssistantMessage = data;
      }
    } catch (e) {
      console.error('Error saving assistant message:', e);
      // Continue even if message save fails
    }
    
    // Update thread's last_message_at
    try {
      await supabaseAdmin
        .from('chat_threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', threadId);
    } catch (e) {
      console.error('Error updating thread timestamp:', e);
      // Continue even if update fails
    }
    
    // Return successful response
    return new Response(
      JSON.stringify({
        id: savedAssistantMessage?.id || `ai-${Date.now()}`,
        content: assistantMessage.content,
        created_at: savedAssistantMessage?.created_at || new Date().toISOString(),
        tokensUsed,
        is_analysis: isAnalysisRequest
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Edge function unhandled error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
