import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User as UserIcon,
  Trash2,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Award,
  RefreshCw,
  Copy,
  Check,
  StickyNote,
  ArrowRight,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../lib/aiService';
import { storage } from '../lib/storage';
import { TutorMessage, TutorMode, StudyNote } from '../types';
import { getCurriculumByClass, getChaptersForSubject } from '../lib/cbseData';
import confetti from 'canvas-confetti';

interface AITutorChatProps {
  initialQuestion?: string;
  onOpenNotes?: () => void;
}

const RESPONSE_MODES: { value: TutorMode; label: string; desc: string }[] = [
  { value: 'Step-by-Step', label: 'Step-by-Step', desc: 'Detailed logical walkthrough & derivations' },
  { value: 'Explain Simply', label: 'Explain Simply', desc: 'Everyday analogies & simple wording' },
  { value: 'Exam Answer', label: 'Exam Answer', desc: 'CBSE marking scheme & keywords' },
  { value: 'Deep Explanation', label: 'Deep Explanation', desc: 'Theory, proofs & foundational intuition' },
  { value: 'Give Me a Hint', label: 'Give Me a Hint', desc: 'Socratic guiding clues without spoiling answer' },
  { value: 'Quiz Me', label: 'Quiz Me', desc: 'Test knowledge with quick concept check' }
];

export const AITutorChat: React.FC<AITutorChatProps> = ({
  initialQuestion,
  onOpenNotes
}) => {
  const { user, addXP } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userClass = user?.classLevel || 'Class 9';
  const availableCurriculum = getCurriculumByClass(userClass, user?.subjects);
  const defaultSubject = availableCurriculum[0]?.name || 'Science';
  const defaultChapters = availableCurriculum[0]?.chapters || [];
  const defaultChapterTitle = defaultChapters[0]?.title || 'Motion';

  // States
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [selectedChapter, setSelectedChapter] = useState<string>(defaultChapterTitle);
  const [selectedMode, setSelectedMode] = useState<TutorMode>('Step-by-Step');
  const [inputMessage, setInputMessage] = useState<string>(initialQuestion || '');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Load chat history
  const [messages, setMessages] = useState<TutorMessage[]>(() => {
    if (!user) return [];
    const saved = storage.getChatHistory(user.uid, selectedSubject);
    if (saved.length > 0) return saved;

    return [
      {
        id: 'welcome_msg',
        role: 'assistant',
        content: `Namaste ${user.name}! 🙏 I'm EduGenius AI, your personal CBSE tutor for **${user.classLevel}**.\n\nI'm ready in **${selectedMode}** mode for **${selectedSubject}** (*${selectedChapter}*). What question, math problem, or concept doubt can we solve step-by-step today?`,
        timestamp: new Date().toISOString(),
        subject: selectedSubject,
        chapter: selectedChapter,
        suggestions: [
          'Derive the equations of motion step-by-step',
          'Give me an important 3-mark CBSE question',
          'Explain the sign convention for mirrors and lenses',
          'What are the most common student mistakes here?'
        ]
      }
    ];
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Speech recognition is not supported in this browser environment.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Text-to-Speech
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text to speech is not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isSpeaking && speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/[*#_`>~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/>> Suggested:[\s\S]*/i, '')
      .slice(0, 450);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    setIsSpeaking(true);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: TutorMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
      subject: selectedSubject,
      chapter: selectedChapter
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsTyping(true);

    if (user) {
      storage.saveChatMessage(user.uid, userMsg);
    }

    try {
      const response = await aiService.chatWithTutor({
        message: textToSend,
        history: newHistory.map(m => ({ role: m.role, content: m.content })),
        classLevel: user?.classLevel || 'Class 9',
        subject: selectedSubject,
        chapter: selectedChapter,
        mode: selectedMode
      });

      const aiMsg: TutorMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        subject: selectedSubject,
        chapter: selectedChapter,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
      if (user) {
        storage.saveChatMessage(user.uid, aiMsg);
        addXP(15, 'Engaged with AI Tutor');
      }
    } catch (error: any) {
      const errorMsg: TutorMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `I'm having a brief connection issue: ${error.message || 'Please retry'}. Let me help you with your question again!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  // Save to Study Notes
  const handleSaveToNotes = (msg: TutorMessage) => {
    if (!user) return;
    const firstLine = msg.content.split('\n')[0].replace(/[*#]/g, '').trim() || `${selectedSubject} Revision Note`;
    const newNote: StudyNote = {
      id: 'note_' + Date.now(),
      userId: user.uid,
      title: firstLine.slice(0, 50),
      content: msg.content,
      subject: selectedSubject,
      chapter: selectedChapter,
      tags: ['AI Tutor', selectedMode],
      updatedAt: new Date().toISOString()
    };
    storage.saveNote(user.uid, newNote);
    setSavedNoteId(msg.id);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setSavedNoteId(null), 3000);
  };

  // Clear chat
  const handleClear = () => {
    if (user) {
      storage.clearChatHistory(user.uid);
    }
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: `Conversation reset. Ready to dive into **${selectedSubject}** for ${user?.classLevel || 'Class 9'}. Ask me anything!`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Give me a 5-minute summary of this chapter',
          'What are the most common mistakes students make here?',
          'Test my knowledge with a concept check'
        ]
      }
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-indigo-950/30 overflow-hidden animate-in fade-in">
      {/* Top Header / Context & Mode Selector */}
      <div className="border-b border-white/10 p-3 sm:p-4 bg-white/[0.04] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md border border-white/15">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white">
                  EduGenius AI Teacher
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  {selectedMode}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Socratic CBSE coach • Voice enabled • Adapts to {userClass}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value as TutorMode)}
              className="text-xs font-bold p-2 rounded-xl border border-white/15 bg-slate-900/90 text-slate-200 focus:outline-none shadow-sm backdrop-blur-md cursor-pointer"
            >
              {RESPONSE_MODES.map(mode => (
                <option key={mode.value} value={mode.value} className="bg-slate-900 text-slate-200">
                  {mode.label} ({mode.desc})
                </option>
              ))}
            </select>

            <button
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Clear Conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subject & Chapter Selectors */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-white/10 text-xs">
          <span className="text-[11px] font-bold text-slate-400">Curriculum Context:</span>
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              const found = availableCurriculum.find(s => s.name === e.target.value);
              if (found && found.chapters.length > 0) {
                setSelectedChapter(found.chapters[0].title);
              }
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md"
          >
            {availableCurriculum.map(s => (
              <option key={s.id} value={s.name} className="bg-slate-900 text-slate-200">
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedChapter}
            onChange={e => setSelectedChapter(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 max-w-[240px] truncate backdrop-blur-md"
          >
            {(
              availableCurriculum.find(s => s.name === selectedSubject)?.chapters || []
            ).map(ch => (
              <option key={ch.id} value={ch.title} className="bg-slate-900 text-slate-200">
                Ch {ch.number}: {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md border border-white/15 mt-1">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 backdrop-blur-md shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs border border-white/15'
                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                {msg.content}
              </div>

              {/* Action buttons for AI replies */}
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakText(msg.content, msg.id)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title={isSpeaking && speakingMsgId === msg.id ? 'Stop audio' : 'Listen with TTS'}
                    >
                      {isSpeaking && speakingMsgId === msg.id ? (
                        <VolumeX className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSaveToNotes(msg)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-amber-300"
                      title="Save to Study Notes"
                    >
                      {savedNoteId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <StickyNote className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title="Copy explanation"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={handleRegenerate}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-indigo-300"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Clickable Follow-up Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    Recommended Follow-ups:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-colors text-left backdrop-blur-sm cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md border border-white/15 mt-1">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md border border-white/15">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs flex items-center gap-2 backdrop-blur-md">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium ml-1">Your AI Teacher is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Voice & Send */}
      <div className="border-t border-white/10 p-3 sm:p-4 bg-white/[0.03] backdrop-blur-md">
        {voiceNotice && (
          <div className="mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
            <span>{voiceNotice}</span>
            <button type="button" onClick={() => setVoiceNotice(null)} className="text-amber-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            id="btn-voice-input"
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-400 ring-2 ring-red-400/30 animate-pulse'
                : 'border-white/15 text-slate-300 hover:bg-white/10 backdrop-blur-md'
            }`}
            title={isListening ? 'Listening... click to finish' : 'Click to talk via Voice'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            id="input-tutor-message"
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : `Ask any question on ${selectedChapter}...`
            }
            className="flex-1 text-xs p-3 rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />

          <button
            id="btn-send-tutor"
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
