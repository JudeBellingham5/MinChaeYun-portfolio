import { motion } from 'motion/react';
import { ExternalLink, Github, FileText, Presentation, Layout } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  key?: string;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const getIcon = () => {
    switch (project.resultType) {
      case 'PPT': return <Presentation size={18} />;
      case 'Report': return <FileText size={18} />;
      case 'Site': return <ExternalLink size={18} />;
      case 'GitHub': return <Github size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  const getCTA = () => {
    switch (project.resultType) {
      case 'PPT': return '전략 기획안 및 상세 PPT는 아래 링크에서 확인하실 수 있습니다';
      case 'Report': return '데이터 분석 결과 및 상세 보고서는 링크를 통해 확인 가능합니다';
      case 'Site': return '프로젝트 결과물 및 서비스 상세 내용은 링크에서 확인해 보세요';
      default: return '상세 내용을 링크를 통해 확인해 보세요';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full"
    >
      <div className="aspect-video overflow-hidden relative bg-slate-100">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Layout size={40} />
          </div>
        )}
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-3">
          {project.category}
        </p>
        <h3 className="text-xl font-bold mb-4 leading-tight serif group-hover:text-slate-700 transition-colors break-keep">
          {project.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-y-3 mb-6 border-y border-slate-50 py-4">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">작업 기간</p>
            <p className="text-[11px] font-bold text-slate-900">{project.period || '-'}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">작업 인원</p>
            <p className="text-[11px] font-bold text-slate-900">{project.personnel || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">작업 툴</p>
            <p className="text-[11px] font-bold text-slate-900">{project.tools?.join(', ') || '-'}</p>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed whitespace-pre-line break-keep">
          {project.oneLiner}
        </p>
        
        <div className="space-y-4 mt-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase mb-2 tracking-wider">Key Deliverables</p>
            <div className="flex flex-wrap gap-2">
              {project.highlights.map((h, i) => (
                <span key={i} className="text-[11px] bg-slate-50 text-slate-600 px-2 py-1 rounded">
                  {h}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-50 flex flex-col gap-4">
            <span className="text-[11px] font-medium text-slate-400 italic">
              {getCTA()}
            </span>
            <div className="flex gap-4 items-center justify-end">
              {project.links?.ppt && (
                <a href={project.links.ppt} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-900 hover:text-red-600 text-xs font-bold transition-colors group/link">
                  <Presentation size={14} className="group-hover/link:scale-110 transition-transform" />
                  <span className="border-b border-slate-900 group-hover/link:border-red-600">View PPT</span>
                </a>
              )}
              {project.links?.report && (
                <a href={project.links.report} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-900 hover:text-red-600 text-xs font-bold transition-colors group/link">
                  <FileText size={14} className="group-hover/link:scale-110 transition-transform" />
                  <span className="border-b border-slate-900 group-hover/link:border-red-600">View Data & Report</span>
                </a>
              )}
              {project.links?.site && (
                <a href={project.links.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-900 hover:text-red-600 text-xs font-bold transition-colors group/link">
                  <ExternalLink size={14} className="group-hover/link:scale-110 transition-transform" />
                  <span className="border-b border-slate-900 group-hover/link:border-red-600">View Site</span>
                </a>
              )}
              {project.links?.site2 && (
                <a href={project.links.site2} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-900 hover:text-red-600 text-xs font-bold transition-colors group/link">
                  <ExternalLink size={14} className="group-hover/link:scale-110 transition-transform" />
                  <span className="border-b border-slate-900 group-hover/link:border-red-600">View Site 2</span>
                </a>
              )}
              {project.links?.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-900 rounded-full hover:bg-slate-200 transition-colors" title="GitHub">
                  <Github size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
