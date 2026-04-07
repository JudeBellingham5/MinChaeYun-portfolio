import React, { useState, useEffect } from 'react';
import { Lock, Save, Plus, Trash2, LogOut, UploadCloud } from 'lucide-react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import { PortfolioData, Project } from '../types';
import { initialData } from '../data';

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);

  useEffect(() => {
    // Check for local data that might need migration
    const local = localStorage.getItem('portfolio_data');
    if (local) setHasLocalData(true);

    // Track auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    // Load data from Firestore
    const unsubscribeData = onSnapshot(doc(db, 'settings', 'portfolio'), (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data() as PortfolioData);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSave = async (dataToSave = data) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'portfolio'), dataToSave);
      alert('서버에 성공적으로 저장되었습니다!');
      // Clear local data after successful migration if it was a migration
      if (hasLocalData) {
        localStorage.removeItem('portfolio_data');
        setHasLocalData(false);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert('저장 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const migrateLocalData = () => {
    const local = localStorage.getItem('portfolio_data');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const merged = { ...initialData, ...parsed };
        setData(merged);
        handleSave(merged);
      } catch (e) {
        console.error('Migration error:', e);
      }
    }
  };

  const updateProject = (type: 'main' | 'additional', id: string, field: keyof Project, value: any) => {
    const list = type === 'main' ? [...data.mainProjects] : [...data.additionalWork];
    const index = list.findIndex(p => p.id === id);
    if (index > -1) {
      list[index] = { ...list[index], [field]: value };
      setData({ ...data, [type === 'main' ? 'mainProjects' : 'additionalWork']: list });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }
        if (file.size > 4 * 1024 * 1024) {
          alert('이미지 크기는 4MB 이하여야 합니다. (현재 파일이 너무 큽니다)');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          callback(reader.result as string);
        };
        reader.onerror = () => {
          console.error('File reading error');
          alert('이미지 파일을 읽는 중 오류가 발생했습니다.');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 serif">Admin Access</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Sign in with Google to manage your portfolio</p>
          
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3"
          >
            Google 로그인
          </button>
          
          <p className="mt-6 text-[10px] text-slate-400 text-center uppercase tracking-widest">
            Authorized: maxmin0925@gmail.com
          </p>
        </div>
      </div>
    );
  }

  // Check if the logged in user is the admin
  if (user.email !== 'maxmin0925@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
          <h2 className="text-xl font-bold mb-4">권한이 없습니다</h2>
          <p className="text-slate-500 mb-8">이 계정({user.email})은 관리자 권한이 없습니다.</p>
          <button onClick={handleLogout} className="text-slate-900 font-bold underline">다른 계정으로 로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold serif mb-2">Portfolio Manager</h1>
            <p className="text-slate-500">Update your projects and information</p>
          </div>
          <div className="flex gap-4">
            {hasLocalData && (
              <button 
                onClick={migrateLocalData}
                className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-600 font-bold rounded-xl border border-amber-100 hover:bg-amber-100 transition-all"
                title="브라우저에 저장된 데이터를 서버로 업로드합니다"
              >
                <UploadCloud size={18} />
                Local {'->'} Server
              </button>
            )}
            <button 
              onClick={() => {
                if (window.confirm('서버의 모든 데이터를 초기 상태로 되돌리시겠습니까?')) {
                  handleSave(initialData);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 font-bold rounded-xl border border-red-100 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} />
              Reset Server
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
            <button 
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-12">
          {/* Profile Information Section */}
          <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold serif mb-8">Profile Information</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Image</label>
                <div className="flex gap-4 items-center">
                  <input 
                    value={data.profileImage} 
                    onChange={(e) => setData({ ...data, profileImage: e.target.value })}
                    className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm"
                    placeholder="Image URL or upload ->"
                  />
                  <label className="cursor-pointer px-6 py-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-bold">
                    Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, (base64) => setData({ ...data, profileImage: base64 }))} 
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Birth Date</label>
                <input 
                  value={data.birthDate} 
                  onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  placeholder="YYYY.MM.DD"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Education (One per line)</label>
                <textarea 
                  value={data.education?.join('\n') || ''} 
                  onChange={(e) => setData({ ...data, education: e.target.value.split('\n') })}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[220px] leading-relaxed"
                  placeholder="XX대학교 XX학과 졸업 (20XX.XX - 20XX.XX)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Certifications (One per line)</label>
                <textarea 
                  value={data.certifications?.join('\n') || ''} 
                  onChange={(e) => setData({ ...data, certifications: e.target.value.split('\n') })}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[180px] leading-relaxed"
                  placeholder="ADsP (데이터분석 준전문가)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bio Title (About Me Heading)</label>
                <textarea 
                  value={data.bioTitle} 
                  onChange={(e) => setData({ ...data, bioTitle: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none min-h-[100px]"
                  placeholder="문제를 정의하고, \n데이터에서 답을 찾습니다."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bio Description (About Me Text)</label>
                <textarea 
                  value={data.bioDescription} 
                  onChange={(e) => setData({ ...data, bioDescription: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none min-h-[150px]"
                  placeholder="저는 데이터를 단순 정리에 그치지 않고 문제 해석 도구로 사용합니다..."
                />
              </div>
            </div>
          </section>

          {/* Main Projects Section */}
          <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold serif">Main Projects</h2>
            </div>
            <div className="space-y-8">
              {data.mainProjects.map((project) => (
                <div key={project.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                      <input 
                        value={project.title} 
                        onChange={(e) => updateProject('main', project.id, 'title', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">One Liner</label>
                      <textarea 
                        value={project.oneLiner} 
                        onChange={(e) => updateProject('main', project.id, 'oneLiner', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                      <input 
                        value={project.category} 
                        onChange={(e) => updateProject('main', project.id, 'category', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea 
                        value={project.description} 
                        onChange={(e) => updateProject('main', project.id, 'description', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Work Period</label>
                      <input 
                        value={project.period || ''} 
                        onChange={(e) => updateProject('main', project.id, 'period', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                        placeholder="2023.01 - 2023.03"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tools (Comma separated)</label>
                      <input 
                        value={project.tools?.join(', ') || ''} 
                        onChange={(e) => updateProject('main', project.id, 'tools', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                        placeholder="Python, Excel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Personnel</label>
                      <input 
                        value={project.personnel || ''} 
                        onChange={(e) => updateProject('main', project.id, 'personnel', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                        placeholder="개인 프로젝트"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Project Image</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          value={project.image} 
                          onChange={(e) => updateProject('main', project.id, 'image', e.target.value)}
                          className="flex-1 p-3 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                          placeholder="Image URL or upload ->"
                        />
                        <label className="cursor-pointer px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-bold">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, (base64) => updateProject('main', project.id, 'image', base64))} 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">PPT Link</label>
                      <input 
                        value={project.links?.ppt || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, ppt: e.target.value };
                          updateProject('main', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Report Link</label>
                      <input 
                        value={project.links?.report || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, report: e.target.value };
                          updateProject('main', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Site Link 1</label>
                      <input 
                        value={project.links?.site || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, site: e.target.value };
                          updateProject('main', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Site Link 2</label>
                      <input 
                        value={project.links?.site2 || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, site2: e.target.value };
                          updateProject('main', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Work Section */}
          <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold serif mb-8">Additional Work</h2>
            <div className="space-y-8">
              {data.additionalWork.map((project) => (
                <div key={project.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                      <input 
                        value={project.title} 
                        onChange={(e) => updateProject('additional', project.id, 'title', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">One Liner</label>
                      <textarea 
                        value={project.oneLiner} 
                        onChange={(e) => updateProject('additional', project.id, 'oneLiner', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Work Period</label>
                      <input 
                        value={project.period || ''} 
                        onChange={(e) => updateProject('additional', project.id, 'period', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tools (Comma separated)</label>
                      <input 
                        value={project.tools?.join(', ') || ''} 
                        onChange={(e) => updateProject('additional', project.id, 'tools', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Personnel</label>
                      <input 
                        value={project.personnel || ''} 
                        onChange={(e) => updateProject('additional', project.id, 'personnel', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Project Image</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          value={project.image} 
                          onChange={(e) => updateProject('additional', project.id, 'image', e.target.value)}
                          className="flex-1 p-3 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                          placeholder="Image URL or upload ->"
                        />
                        <label className="cursor-pointer px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-bold">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, (base64) => updateProject('additional', project.id, 'image', base64))} 
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Site Link 1</label>
                      <input 
                        value={project.links?.site || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, site: e.target.value };
                          updateProject('additional', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Site Link 2</label>
                      <input 
                        value={project.links?.site2 || ''} 
                        onChange={(e) => {
                          const links = { ...project.links, site2: e.target.value };
                          updateProject('additional', project.id, 'links', links);
                        }}
                        placeholder="https://..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
