'use client';

import { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

interface SwipeQuizProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  initialAnswers?: Record<string, string>;
}

export default function SwipeQuiz({ questions, onComplete, initialAnswers = {} }: SwipeQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentQuestion = questions[currentIndex];
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 50 && currentIndex > 0) {
          goToPrevious();
        } else if (e.deltaX < -50 && currentIndex < questions.length - 1) {
          goToNext();
        }
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, questions.length]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchStartX(touch.clientX);
      setTouchStartY(touch.clientY);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      
      if (deltaX > 50 && currentIndex > 0) {
        setSwipeDirection('right');
      } else if (deltaX < -50 && currentIndex < questions.length - 1) {
        setSwipeDirection('left');
      }
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    if (e.changedTouches.length === 0) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const touchEndX = touch.clientX;
    const deltaX = touchEndX - touchStartX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0 && currentIndex > 0) {
        goToPrevious();
      } else if (deltaX < 0 && currentIndex < questions.length - 1) {
        goToNext();
      }
    }
    
    setTouchStartX(null);
    setTouchStartY(null);
    setSwipeDirection(null);
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleOptionClick = (value: string) => {
    if (!currentQuestion) return;
    
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    setSelectedIndex(currentQuestion.options.findIndex(opt => opt.value === value));
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedIndex(-1);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };
  
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  
  if (!currentQuestion) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded-2xl p-6 shadow-xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicators */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#242424] active:scale-95'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-400">Pergunta {currentIndex + 1} de {questions.length}</div>
          <div className="text-xs text-[#00D4FF] mt-1">Deslize para navegar</div>
        </div>
        
        <button
          onClick={goToNext}
          disabled={currentIndex === questions.length - 1}
          className={`p-2 rounded-full transition-all ${currentIndex === questions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#242424] active:scale-95'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-[#242424] rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentQuestion.question}</h2>
        <p className="text-gray-400">Selecione uma opção abaixo</p>
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                isSelected 
                  ? 'border-[#00D4FF] bg-[#00D4FF]/10 transform scale-[1.02] shadow-lg shadow-[#00D4FF]/20' 
                  : 'border-[#242424] hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5'
              } ${selectedIndex === index ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-4">
                {option.icon && (
                  <div className={`text-2xl transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {option.icon}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg">{option.label}</div>
                  <div className="text-sm text-gray-400 mt-1">Clique para selecionar</div>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-[#00D4FF] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                isSelected ? 'bg-[#00D4FF]' : 'bg-transparent'
              } transition-all duration-300`}></div>
            </button>
          );
        })}
      </div>
      
      {/* Swipe hint */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Deslize para voltar</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Selecione uma opção</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Deslize para avançar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Answers summary */}
      {Object.keys(answers).length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#242424]">
          <div className="text-sm text-gray-400 mb-3">Suas respostas:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(answers).map(([questionId, answer]) => {
              const question = questions.find(q => q.id === questionId);
              const option = question?.options.find(opt => opt.value === answer);
              
              return (
                <div key={questionId} className="px-3 py-1 bg-[#242424] rounded-full text-sm">
                  <span className="text-gray-300">{question?.question.split(' ')[0]}:</span>{' '}
                  <span className="text-[#00D4FF]">{option?.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Swipe animation */}
      {swipeDirection && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
          swipeDirection === 'left' ? 'animate-slideOutLeft' : 'animate-slideOutRight'
        }`}>
          <div className="bg-[#00D4FF]/20 rounded-full p-8">
            <svg className="w-12 h-12 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={swipeDirection === 'left' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}