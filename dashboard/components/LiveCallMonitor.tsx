"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, MicOff, UserPlus, Clock } from 'lucide-react';

const CALLERS = [
  { name: 'Sarah Chen', number: '+1 (415) 555-0142', industry: 'Dental' },
  { name: 'Marcus Webb', number: '+1 (312) 555-0198', industry: 'Real Estate' },
  { name: 'Priya Nair', number: '+1 (206) 555-0177', industry: 'Legal' },
];

const TRANSCRIPT_SCRIPT = [
  { speaker: 'caller', text: "Hi, I need to reschedule my appointment for next week." },
  { speaker: 'ai', text: "I can help with that. Let me pull up your current booking." },
  { speaker: 'ai', text: "I see you're scheduled for Tuesday at 2 PM. What day works better for you?" },
  { speaker: 'caller', text: "Could we do Thursday morning instead?" },
  { speaker: 'ai', text: "Thursday at 9 AM is open — shall I book that for you?" },
  { speaker: 'caller', text: "Yes, that works great, thank you." },
];

function useFakeClock(startedSecondsAgo: number) {
  const [elapsed, setElapsed] = useState(startedSecondsAgo);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function LivePulse({ active = true }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
    </span>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 75 ? '#10B981' : value >= 45 ? '#F59E0B' : '#EF4444';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">AI Confidence</span>
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  );
}

function CallCard({ caller, onSelect, isSelected }: any) {
  const duration = useFakeClock(caller.startedSecondsAgo);
  return (
    <button
      onClick={() => onSelect(caller.id)}
      className={`w-full text-left rounded-xl border backdrop-blur-xl p-4 transition-all duration-200 ${
        isSelected ? 'border-[#6C63FF]/50 bg-[#6C63FF]/[0.08] shadow-[0_0_0_1px_rgba(108,99,255,0.3)]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <LivePulse />
          <div>
            <p className="text-sm font-semibold text-white">{caller.name}</p>
            <p className="text-xs text-zinc-500">{caller.number}</p>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6C63FF]/15 text-[#8A84FF] font-medium">
          {caller.industry}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-500">
        <Clock size={12} />
        <span className="tabular-nums">{duration}</span>
      </div>
    </button>
  );
}

export default function LiveCallMonitor() {
  const [calls] = useState(CALLERS.map((c, i) => ({ ...c, id: i, startedSecondsAgo: [42, 187, 15][i] })));
  const [selectedId, setSelectedId] = useState(0);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [confidence, setConfidence] = useState(88);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedCaller = calls.find((c) => c.id === selectedId);

  useEffect(() => {
    setTranscript([]);
    let i = 0;
    const id = setInterval(() => {
      if (i >= TRANSCRIPT_SCRIPT.length) {
        clearInterval(id);
        return;
      }
      setTranscript((t) => [...t, TRANSCRIPT_SCRIPT[i]]);
      setConfidence(60 + Math.floor(Math.random() * 35));
      i++;
    }, 1800);
    return () => clearInterval(id);
  }, [selectedId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="min-h-screen w-full font-sans text-white" style={{ background: '#0A0A0F' }}>
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#6C63FF] flex items-center justify-center font-bold text-sm">V</div>
          <div>
            <h1 className="text-sm font-semibold leading-none">VoiceOS</h1>
            <p className="text-[11px] text-zinc-500 leading-none mt-1">Live Call Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <LivePulse />
          <span>{calls.length} active calls</span>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium px-1">Active Calls</p>
          {calls.map((c) => (
            <CallCard key={c.id} caller={c} onSelect={setSelectedId} isSelected={c.id === selectedId} />
          ))}
        </div>

        <GlassCard className="p-6 flex flex-col min-h-[560px]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">{selectedCaller?.name}</h2>
              <p className="text-sm text-zinc-500">{selectedCaller?.number}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                <MicOff size={16} className="text-zinc-300" />
              </button>
              <button className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                <UserPlus size={16} className="text-zinc-300" />
              </button>
              <button className="h-9 px-3 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/30 flex items-center gap-1.5 transition-colors">
                <PhoneOff size={14} className="text-[#EF4444]" />
                <span className="text-xs font-medium text-[#EF4444]">End</span>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <ConfidenceMeter value={confidence} />
          </div>

          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-3">Live Transcript</p>
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin' }}>
            {transcript.length === 0 && (
              <p className="text-sm text-zinc-600 italic">Waiting for conversation to begin…</p>
            )}
            {transcript.map((line, idx) => (
              <div key={idx} className={`flex ${line.speaker === 'ai' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  line.speaker === 'ai' ? 'bg-[#6C63FF]/15 border border-[#6C63FF]/20 text-white' : 'bg-white/[0.04] border border-white/10 text-zinc-200'
                }`}>
                  <p className="text-[10px] uppercase tracking-wider mb-1 opacity-50 font-medium">
                    {line.speaker === 'ai' ? 'VoiceOS AI' : 'Caller'}
                  </p>
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
