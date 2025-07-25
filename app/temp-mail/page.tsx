'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { CopyIcon, RefreshCw, InboxIcon, MailIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';

// Loading screen component for temp mail page
function TempMailLoadingScreen() {
  const [statusText, setStatusText] = useState("Initializing secure email service");
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Initializing secure email service",
    "Connecting to temporary mail servers",
    "Generating disposable email address",
    "Setting up inbox monitoring",
    "Establishing secure connections",
    "Preparing email reception system",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStatusText(statusMessages[statusIndex]);
  }, [statusIndex]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 text-white"
      style={{
        background: "linear-gradient(135deg, #0f1419 0%, #1a365d 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center mb-12">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center border-2 shadow-lg relative overflow-hidden flex-shrink-0 animate-pulse-custom mb-6"
          style={{
            background: "linear-gradient(45deg, #1a365d, #2d3748)",
            borderColor: "#4299e1",
            boxShadow: "0 0 20px rgba(66, 153, 225, 0.3)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 8C3.5 8 7.5 10.5 12 10.5C16.5 10.5 20.5 8 20.5 8M20.5 11V8L12 4L3.5 8V11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12 10.5V20M12 10.5C7.5 10.5 3.5 8 3.5 8V16.5C3.5 16.5 7.5 20 12 20C16.5 20 20.5 16.5 20.5 16.5V8C20.5 8 16.5 10.5 12 10.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z" stroke="#4299e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <div
          className="text-3xl font-bold mb-2"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Temporary Email Service
        </div>
        <p className="text-blue-300 text-center max-w-md text-sm">
          Setting up your private, disposable email address
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <span>{statusText}</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>
      
      <div
        className="w-12 h-12 border-4 border-t-blue-400 rounded-full animate-spin"
        style={{
          borderColor: "rgba(66, 153, 225, 0.2)",
          borderTopColor: "#4299e1",
        }}
      />
    </div>
  );
}

interface EmailMessage {
  id: string;
  from: { address: string };
  subject: string;
  intro: string;
  createdAt: string;
  text?: string;
  body?: string;
}

interface TempMailResponse {
  success: boolean;
  email: string;
  password?: string;
  token: string;
  message: string;
}

interface MessageResponse {
  success: boolean;
  messages: EmailMessage[];
}

export default function TempMailPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  const generateNewEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://gods-eye-api.onrender.com/api/email/generate');
      const data: TempMailResponse = await response.json();
      if (data.success) {
        setEmail(data.email);
        setPassword(data.password || '');
        setToken(data.token);
        setMessages([]);
        toast({ title: "New email generated", description: "Your temporary email is ready to use" });
      } else {
        toast({ title: "Error", description: "Failed to generate email", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate email", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkMessages = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      const response = await fetch(`https://gods-eye-api.onrender.com/api/email/messages?token=${token}`);
      const data: MessageResponse = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Copied!", description: "Email address copied to clipboard" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy to clipboard", variant: "destructive" });
    }
  };

  useEffect(() => {
    generateNewEmail();
    const interval = setInterval(checkMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMessageClick = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Loading Screen */}
      {loading && <TempMailLoadingScreen />}
      {/* Header with Logo */}
      <div className="container mx-auto pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-8 animate-fade-in-down">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-lg relative overflow-hidden flex-shrink-0 animate-pulse-custom"
              style={{
                background: "linear-gradient(45deg, #1a365d, #2d3748)",
                borderColor: "#4299e1",
                boxShadow: "0 0 20px rgba(66, 153, 225, 0.3)",
              }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path d="M3.5 8C3.5 8 7.5 10.5 12 10.5C16.5 10.5 20.5 8 20.5 8M20.5 11V8L12 4L3.5 8V11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 10.5V20M12 10.5C7.5 10.5 3.5 8 3.5 8V16.5C3.5 16.5 7.5 20 12 20C16.5 20 20.5 16.5 20.5 16.5V8C20.5 8 16.5 10.5 12 10.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z" stroke="#4299e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 gradient-text">Temporary Email Service</h1>
          <p className="text-blue-300 text-center max-w-2xl text-sm md:text-base">
            Generate disposable email addresses to protect your privacy and avoid spam
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6 animate-fade-in-up">
        {/* Email Generator Card */}
        <Card className="glass border-0 overflow-hidden shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-1">
            <div className="flex items-center px-4 py-3">
              <MailIcon className="h-5 w-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-medium text-white">Your Temporary Email</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-lg bg-slate-700/50" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-40 rounded-lg bg-slate-700/50" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50 hover-lift transition-all duration-300">
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="w-full">
                    <p className="text-xs text-slate-400 mb-1">Email Address:</p>
                    <div className="flex items-center justify-between gap-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2 max-w-[calc(100%-40px)]">
                        <span className="text-white text-base sm:text-lg font-mono whitespace-nowrap">{email}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard} 
                        className="hover:bg-blue-900/30 text-blue-400 hover:text-blue-300 flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={generateNewEmail} 
                    className="bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:translate-y-[-2px]" 
                    disabled={loading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate New Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Inbox Card */}
        <Card className="glass border-0 overflow-hidden shadow-xl rounded-xl">
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-1">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <InboxIcon className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-lg font-medium text-white">Inbox</h2>
              </div>
              <Button 
                onClick={checkMessages} 
                variant="ghost" 
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30" 
                disabled={refreshing}
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto bg-slate-800/80 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                  <InboxIcon className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-slate-300 text-lg font-medium mb-2">Your inbox is empty</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  No messages yet. They will appear here automatically when you receive them.
                </p>
                <div className="mt-4 flex items-center justify-center text-slate-500 text-sm">
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin opacity-70" />
                  Checking for new messages every 15 seconds
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden hover:bg-slate-800 transition-all duration-300 hover-lift"
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-base sm:text-lg line-clamp-1">{message.subject}</h3>
                          <p className="text-blue-400 text-xs sm:text-sm">{message.from.address}</p>
                        </div>
                        <div className="text-slate-400 text-xs whitespace-nowrap ml-4">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">{message.intro}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-slate-400">
                          {expandedMessageId === message.id ? 'Click to collapse' : 'Click to read'}
                        </div>
                        {expandedMessageId === message.id ? (
                          <ChevronUpIcon className="h-4 w-4 text-blue-400" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedMessageId === message.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 animate-fade-in">
                        <div className="bg-slate-900/50 p-4 rounded-lg text-slate-200 prose prose-sm max-w-none prose-headings:text-blue-300 prose-a:text-blue-400 overflow-auto">
                          <div dangerouslySetInnerHTML={{ __html: message.text || message.body || '' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {/* Footer Info */}
        <div className="text-center text-slate-500 text-xs mt-8 animate-fade-in">
          <p>Temporary emails expire after 24 hours. All data is automatically deleted.</p>
          <p className="mt-1">© {new Date().getFullYear()} God's Eye Security Services</p>
        </div>
      </div>
    </div>
  );
}