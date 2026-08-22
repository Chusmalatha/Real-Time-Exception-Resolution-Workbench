import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, AlertCircle, Loader2, Info, MessageSquare, X } from 'lucide-react';
import { explainTransaction, chatWithAI } from '../services/aiService';

export default function AIEmployeePanel({ transactionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(true);
  const [explainError, setExplainError] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchExplanation = async () => {
      try {
        setLoadingExplain(true);
        setExplainError(null);
        const data = await explainTransaction(transactionId);
        if (isMounted) setExplanation(data);
      } catch (err) {
        if (isMounted) {
          const errMsg = err?.response?.data?.detail || 'Failed to connect to AI Employee.';
          setExplainError(errMsg);
        }
      } finally {
        if (isMounted) setLoadingExplain(false);
      }
    };

    fetchExplanation();
    return () => { isMounted = false; };
  }, [transactionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const data = await chatWithAI(transactionId, userMessage);
      setChatHistory(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      const errMsg = err?.response?.data?.detail || 'Failed to get response from AI.';
      setChatHistory(prev => [...prev, { role: 'error', content: errMsg }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button to open the drawer */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all z-40 hover:scale-105"
          title="Open AI Employee"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[450px] max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">AI Employee</h2>
            <div className="ml-2 flex items-center gap-1.5 text-xs font-medium bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
              {explainError ? (
                <><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-red-600">Unavailable</span></>
              ) : (
                <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div><span className="text-green-600">Online</span></>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Explanation Section */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-gray-500" /> Analysis
          </h3>
          {loadingExplain ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing transaction...
            </div>
          ) : explainError ? (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{explainError}</p>
            </div>
          ) : explanation ? (
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong className="block text-gray-900 mb-1">Explanation</strong>
                <p>{explanation.explanation}</p>
              </div>
              
              <div>
                <strong className="block text-gray-900 mb-1">Risk Factors</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                  {explanation.risk_factors?.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="block text-gray-900 mb-1">Recommendation</strong>
                <div className="bg-blue-50 text-blue-800 p-3 rounded border border-blue-100">
                  {explanation.recommendation}
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100">
                <strong className="text-gray-900">Confidence Score</strong>
                <span className="font-bold text-lg text-indigo-600">{explanation.confidence}%</span>
              </div>
            </div>
          ) : null}
        </section>

        <hr className="border-gray-100" />

        {/* Chatbot Section */}
        <section className="flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Ask about this transaction</h3>
          
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col min-h-[200px]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {chatHistory.length === 0 ? (
                <div className="text-sm text-gray-400 text-center mt-4">
                  No questions yet. Ask me anything!
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end ml-auto' : 'self-start mr-auto'}`}>
                    <span className="text-xs text-gray-500 mb-1 px-1">
                      {msg.role === 'user' ? 'Reviewer' : 'AI'}
                    </span>
                    <div className={`p-2.5 rounded-lg text-sm whitespace-pre-wrap break-words ${
                      msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 
                      msg.role === 'error' ? 'bg-red-100 text-red-700 rounded-bl-none' :
                      'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="self-start mr-auto flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-auto relative">
              <input
                type="text"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Why was this flagged?"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={chatLoading || explainError}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading || explainError}
                className="absolute right-1 top-1 bottom-1 px-2 text-gray-400 hover:text-indigo-600 disabled:text-gray-300 disabled:bg-transparent"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

      </div>
      </div>
    </>
  );
}
