import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Mail, ChevronRight, Database, BarChart3, Layout, MessageSquare, Calendar, GraduationCap, Award } from 'lucide-react';
import { doc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import AdminPanel from './components/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { initialData } from './data';
import { PortfolioData } from './types';

function Portfolio() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'settings', 'portfolio'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(doc(db, 'settings', 'portfolio'), (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data() as PortfolioData);
      } else {
        // If no data in Firestore, use initialData but don't overwrite Firestore yet
        setData(initialData);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Firestore Error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />
      
      {/* Home Section */}
      <section id="home" className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-12 translate-x-24 hidden sm:block" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-slate-50 -z-10 sm:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6">
            {data.englishName}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-[1.1] mb-8 serif">
            데이터로 해석하고, <br />
            <span className="text-slate-400 italic">전략으로 연결합니다.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed">
            데이터 수집부터 분석, 시각화, 그리고 실행 가능한 전략 도출까지. <br className="hidden sm:block" />
            저는 <span className="text-slate-900 font-bold">데이터</span>를 통해 문제를 구조적으로 해석하고 <span className="text-slate-900 font-bold">성과</span>로 연결하는 <span className="text-slate-900 font-bold">민채윤</span>입니다.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <a 
              href="#projects" 
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 group"
            >
              프로젝트 보기
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
            >
              연락하기
            </a>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl">
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt={data.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Layout size={48} />
                </div>
              )}
            </div>
            
            {/* Mobile/Tablet Info Box */}
            <div className="mt-8 md:hidden bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Birth</p>
                  <p className="text-sm font-bold text-slate-900">{data.birthDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Education</p>
                  <div className="space-y-1">
                    {data.education?.map((edu, i) => (
                      <p key={i} className="text-sm font-bold text-slate-900 break-words">{edu}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Floating Info Box */}
            <div className="absolute -bottom-12 -right-12 w-80 md:w-96 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Birth</p>
                    <p className="text-sm font-bold text-slate-900">{data.birthDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Education</p>
                    <div className="space-y-1">
                      {data.education?.map((edu, i) => (
                        <p key={i} className="text-sm font-bold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">{edu}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="pt-12 lg:pt-0">
            <h2 className="text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6">About Me</h2>
            <h3 className="text-4xl font-bold mb-8 serif leading-tight whitespace-pre-line break-keep">
              {data.bioTitle}
            </h3>
            <p className="text-slate-600 text-lg mb-12 leading-relaxed break-keep">
              {data.bioDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Award size={16} />
                  Certifications
                </h4>
                <ul className="space-y-3">
                  {data.certifications?.map((cert, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight size={16} />
                  Core Values
                </h4>
                <ul className="space-y-3">
                  {[
                    "문제 정의 및 데이터 수집의 일관성",
                    "분석 결과의 전략적 재구성",
                    "실행 가능한 인사이트 도출"
                  ].map((text, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6">Main Projects</h2>
              <h3 className="text-4xl font-bold serif">프로젝트 목록</h3>
            </div>
            <p className="text-slate-400 max-w-md text-sm">
              데이터를 기반으로 마케팅 문제를 구조적으로 해석하고, 
              실제 실행 가능한 전략으로 연결한 주요 프로젝트들입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.mainProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Work */}
      <section className="section-padding bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-xs font-bold tracking-[0.4em] text-slate-500 uppercase mb-6">Additional Work</h2>
            <h3 className="text-4xl font-bold serif">구현과 실행의 경험</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {data.additionalWork.map((project, index) => (
              <div key={project.id} className="group relative bg-white/5 border border-white/10 p-6 sm:p-10 rounded-3xl hover:bg-white/10 transition-all duration-500 h-full">
                <div className="flex flex-col h-full">
                  <div className="w-full aspect-video sm:aspect-square rounded-2xl overflow-hidden mb-8">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                        <Layout size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-4">{project.category}</p>
                    <h4 className="text-2xl font-bold mb-4 serif break-keep">{project.title}</h4>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Period:</span>
                        <span className="text-slate-300">{project.period || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Personnel:</span>
                        <span className="text-slate-300">{project.personnel || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-slate-600">Tools:</span>
                        <span className="text-slate-300">{project.tools?.join(', ') || '-'}</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-8 leading-relaxed whitespace-pre-line break-keep flex-1">{project.oneLiner}</p>
                    <div className="flex gap-4 mt-auto">
                      {project.links?.site && (
                        <a 
                          href={project.links.site} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors"
                        >
                          Visit Site <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6">Expertise</h2>
            <h3 className="text-4xl font-bold serif">핵심 역량</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.skills.map((skill, index) => {
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400', border: 'hover:border-blue-200' },
                { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', border: 'hover:border-emerald-200' },
                { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', border: 'hover:border-amber-200' },
                { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-400', border: 'hover:border-rose-200' }
              ][index % 4];

              return (
                <motion.div
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-10 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-100 transition-all ${colors.border}`}
                >
                  <div className={`mb-8 p-4 ${colors.bg} ${colors.text} rounded-2xl w-fit shadow-sm`}>
                    {index === 0 && <Database size={24} strokeWidth={2.5} />}
                    {index === 1 && <BarChart3 size={24} strokeWidth={2.5} />}
                    {index === 2 && <Layout size={24} strokeWidth={2.5} />}
                    {index === 3 && <MessageSquare size={24} strokeWidth={2.5} />}
                  </div>
                  <h4 className="text-lg font-bold mb-6 serif">{skill.category}</h4>
                  <ul className="space-y-4">
                    {skill.items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-500 leading-relaxed flex gap-3">
                        <span className={`w-1.5 h-1.5 ${colors.dot} rounded-full mt-2 shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6">Get In Touch</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-12 serif leading-tight">
            데이터와 마케팅의 연결고리를 <br />
            함께 만들어가고 싶습니다.
          </h3>
          <p className="text-slate-500 mb-12 text-lg">
            프로젝트와 포트폴리오에 대해 더 이야기하고 싶다면 <br />
            아래 메일로 언제든 연락 부탁드립니다.
          </p>
          
          <div className="inline-flex flex-col items-center">
            <a 
              href={`mailto:${data.email}`}
              className="text-2xl md:text-3xl font-bold text-slate-900 hover:text-slate-600 transition-colors mb-4 border-b-2 border-slate-900 pb-2"
            >
              {data.email}
            </a>
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              {data.name} | {data.englishName}
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          © 2026 {data.englishName}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ErrorBoundary>
  );
}
