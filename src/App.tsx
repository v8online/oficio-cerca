/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User as UserIcon, 
  Star, 
  Navigation, 
  Hammer, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  LogOut,
  Edit,
  ArrowLeft,
  Briefcase,
  MessageCircle,
  X
} from 'lucide-react';

import { auth, db, loginWithGoogle, logout } from './lib/firebase';
import { Profile, ViewState, Review } from './types';
import { DEPARTMENTS, CITIES_BY_DEPARTMENT, OCCUPATIONS } from './constants';
import { handleFirestoreError, OperationType, cn } from './lib/utils';

// --- Components ---

const Navbar = ({ 
  user, 
  profile, 
  onNavigate 
}: { 
  user: User | null; 
  profile: Profile | null; 
  onNavigate: (v: ViewState) => void 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 md:px-8 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate('HOME')}
      >
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
          <Hammer size={20} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-brand-primary hidden sm:block">
          OficioCerca
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('EDIT_PROFILE')}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-cta transition-colors"
            >
              <Edit size={16} />
              Mi Perfil
            </button>
            <div 
              className="w-10 h-10 rounded-full border-2 border-brand-accent overflow-hidden cursor-pointer"
              onClick={() => onNavigate('EDIT_PROFILE')}
            >
              <img src={user.photoURL || ''} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('LOGIN')}
            className="flex items-center gap-2 bg-brand-cta text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <UserIcon size={18} />
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<ViewState>('HOME');
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchDept, setSearchDept] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchOccupation, setSearchOccupation] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Selected Worker
  const [selectedWorker, setSelectedWorker] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Edit Profile Local State
  const [editDept, setEditDept] = useState('');
  const [editCity, setEditCity] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await fetchProfile(u.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile && view === 'EDIT_PROFILE') {
      setEditDept(profile.department || '');
      setEditCity(profile.city || '');
    }
  }, [profile, view]);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'profiles', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        // Create initial profile
        const newProfile: Profile = {
          userId: uid,
          name: auth.currentUser?.displayName || 'Usuario',
          photo: auth.currentUser?.photoURL || '',
          occupations: [],
          department: '',
          city: '',
          experience: 0,
          description: '',
          priceRange: 'Standard',
          phone: '',
          rating: 5,
          ratingCount: 0,
          isWorker: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `profiles/${uid}`, auth);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    setView('SEARCH');
    
    try {
      let q = query(collection(db, 'profiles'), where('isWorker', '==', true));
      
      if (searchDept) {
        q = query(q, where('department', '==', searchDept));
      }
      if (searchCity) {
        q = query(q, where('city', '==', searchCity));
      }
      if (searchOccupation) {
        q = query(q, where('occupations', 'array-contains', searchOccupation));
      }

      const querySnapshot = await getDocs(q);
      const results: Profile[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as Profile);
      });
      setSearchResults(results);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'profiles', auth);
    } finally {
      setSearching(false);
    }
  };

  const selectWorker = async (worker: Profile) => {
    setSelectedWorker(worker);
    setView('PROFILE');
    // Fetch reviews
    try {
      const q = query(
        collection(db, 'profiles', worker.userId, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const r: Review[] = [];
      snap.forEach(d => r.push({ id: d.id, ...d.data() } as Review));
      setReviews(r);
    } catch (err) {
      console.warn("Could not fetch reviews:", err);
      setReviews([]);
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<Profile>) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'profiles', user.uid);
      const finalData = {
        ...updatedData,
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, finalData, { merge: true });
      setProfile(prev => prev ? { ...prev, ...finalData } : null);
      setView('HOME');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `profiles/${user.uid}`, auth);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-brand-cta border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-sm">Cargando OficioCerca...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-accent/30">
      <Navbar user={user} profile={profile} onNavigate={setView} />

      <main className="pt-16 min-h-[calc(100vh-64px)] overflow-x-hidden">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {/* Hero Section */}
              <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-wider">
                    <Navigation size={12} />
                    Provincia de Córdoba
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-primary leading-[1.1] tracking-tight">
                    Encontrá al <span className="text-brand-cta">profesional</span> ideal cerca tuyo.
                  </h1>
                  <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                    Más de 60 oficios y servicios disponibles en toda la provincia. 
                    Conectamos expertos cordobeses con quienes necesitan su ayuda.
                  </p>
                  
                  {/* Search Form Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Departamento</label>
                        <select 
                          value={searchDept}
                          onChange={(e) => { setSearchDept(e.target.value); setSearchCity(''); }}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all"
                        >
                          <option value="">Cualquier Departamento</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ciudad</label>
                        <select 
                          value={searchCity}
                          onChange={(e) => setSearchCity(e.target.value)}
                          disabled={!searchDept}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all disabled:opacity-50"
                        >
                          <option value="">Todas las ciudades</option>
                          {searchDept && CITIES_BY_DEPARTMENT[searchDept]?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-slate-400 text-sm">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Oficio o Servicio</label>
                      <select 
                        value={searchOccupation}
                        onChange={(e) => setSearchOccupation(e.target.value)}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all"
                      >
                        <option value="">Todos los oficios</option>
                        {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <button 
                      onClick={() => handleSearch()}
                      className="h-14 bg-brand-cta text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 mt-2"
                    >
                      <Search size={20} />
                      Buscar Profesionales
                    </button>
                  </div>
                </div>

                <div className="relative hidden lg:block">
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-cta/10 rounded-full blur-3xl"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=1200" 
                    alt="Trabajador Profesional" 
                    className="relative rounded-3xl shadow-2xl z-10 w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4">
                    <div className="flex -space-x-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-primary">+500 Profesionales</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Verificados en Córdoba</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Section */}
              <section className="w-full bg-white border-y border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { label: "Profesionales", value: "2.5k+" },
                    { label: "Localidades", value: "100+" },
                    { label: "Oficios", value: "60+" },
                    { label: "Calificación", value: "4.9/5" }
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-3xl font-display font-bold text-brand-primary">{stat.value}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'SEARCH' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <button 
                    onClick={() => setView('HOME')}
                    className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2 hover:text-brand-cta transition-colors"
                  >
                    <ArrowLeft size={12} />
                    Volver al inicio
                  </button>
                  <h2 className="text-4xl font-display font-bold text-brand-primary">
                    Resultados para <span className="text-brand-cta">{searchOccupation || 'Todos los oficios'}</span>
                  </h2>
                  <p className="text-slate-500 font-medium mt-1">
                    Mostrando {searchResults.length} profesionales en {searchCity || searchDept || 'Toda la provincia'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSearch()}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-brand-cta hover:text-brand-cta transition-all active:scale-95"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>

              {searching ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((worker) => (
                    <motion.div 
                      key={worker.userId}
                      layoutId={worker.userId}
                      onClick={() => selectWorker(worker)}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                          <img 
                            src={worker.photo || 'https://i.pravatar.cc/100'} 
                            alt={worker.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="bg-brand-accent/10 px-3 py-1 rounded-full flex items-center gap-1">
                          <Star size={14} className="fill-brand-accent text-brand-accent" />
                          <span className="text-brand-accent text-sm font-bold">{worker.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-brand-primary truncate">{worker.name}</h3>
                          <div className="flex items-center gap-1 text-slate-400 text-sm mt-0.5">
                            <MapPin size={14} />
                            <span>{worker.city}, {worker.department}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {worker.occupations.slice(0, 3).map(o => (
                            <span key={o} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-500">
                              {o}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{worker.experience} años exp.</span>
                          </div>
                          <div className="flex items-center gap-1 font-bold text-brand-cta">
                            Ver Perfil
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-primary">No encontramos resultados</h3>
                  <p className="text-slate-500 mt-2 max-w-sm">Intentá cambiar los filtros o buscá en un departamento vecino.</p>
                  <button 
                    onClick={() => setView('HOME')}
                    className="mt-6 text-brand-cta font-bold hover:underline"
                  >
                    Volver a intentar
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'PROFILE' && selectedWorker && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <button 
                onClick={() => setView('SEARCH')}
                className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8 hover:text-brand-cta transition-colors"
              >
                <ArrowLeft size={12} />
                Volver a resultados
              </button>

              <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
                {/* Profile Header */}
                <div className="relative h-48 bg-brand-primary overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-cta opacity-80"></div>
                  <div className="absolute top-0 right-0 p-8">
                    <Briefcase className="text-white/20" size={120} />
                  </div>
                </div>

                <div className="px-8 pb-12">
                  <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-6 mb-8">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl border-4 border-white overflow-hidden">
                      <img 
                        src={selectedWorker.photo || 'https://i.pravatar.cc/200'} 
                        alt={selectedWorker.name} 
                        className="w-full h-full object-cover rounded-[1.8rem]"
                      />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-4xl font-display font-bold text-brand-primary">{selectedWorker.name}</h2>
                        <div className="bg-brand-accent/20 px-3 py-1 rounded-full flex items-center gap-1 text-brand-accent font-bold">
                          <Star size={16} className="fill-brand-accent" />
                          {selectedWorker.rating.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                        <MapPin size={18} className="text-brand-cta" />
                        {selectedWorker.city}, {selectedWorker.department}
                      </p>
                    </div>
                    <div className="pb-2">
                      <a 
                        href={`https://wa.me/${selectedWorker.phone}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="h-14 bg-brand-accent text-white px-8 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                      >
                        <Phone size={20} />
                        Contactar vía WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Sobre mí</h4>
                        <p className="text-slate-600 leading-relaxed text-lg">
                          {selectedWorker.description || 'Este profesional no ha agregado una descripción todavía.'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Especialidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWorker.occupations.map(o => (
                            <span key={o} className="px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold border border-slate-100 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-cta"></div>
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Valoraciones ({selectedWorker.ratingCount})</h4>
                        <div className="space-y-6">
                          {reviews.length > 0 ? reviews.map(r => (
                            <div key={r.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                    <img src={r.clientPhoto || `https://i.pravatar.cc/100?u=${r.clientId}`} alt="Client" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm">{r.clientName}</div>
                                    <div className="text-[10px] text-slate-400 font-medium uppercase">{new Date(r.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                <div className="flex text-brand-accent">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < r.rating ? 'fill-brand-accent' : 'text-slate-200'} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm italic">"{r.comment}"</p>
                            </div>
                          )) : (
                            <p className="text-slate-400 italic">No hay reseñas todavía. ¡Sé el primero en calificar!</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experiencia</label>
                          <div className="text-2xl font-display font-bold text-brand-primary flex items-center gap-2">
                            <Clock className="text-brand-cta" size={24} />
                            {selectedWorker.experience} años
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rango de Precio</label>
                          <div className="text-2xl font-display font-bold text-brand-primary flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center text-white text-xs font-bold">$</div>
                            {selectedWorker.priceRange === 'Economic' ? 'Economico' : selectedWorker.priceRange === 'Standard' ? 'Estandar' : 'Premium'}
                          </div>
                        </div>
                        <div className="pt-4">
                          <button className="w-full py-4 border-2 border-brand-cta text-brand-cta rounded-2xl font-bold hover:bg-brand-cta hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                            <ExternalLink size={18} />
                            Ver Portfolio
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-brand-primary text-white p-6 rounded-3xl space-y-4">
                        <h5 className="font-bold">¿Trabajaste con {selectedWorker.name}?</h5>
                        <p className="text-white/60 text-sm">Tu opinión ayuda a otros cordobeses a elegir mejor.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-sm">
                          Dejar una reseña
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'EDIT_PROFILE' && profile && (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto px-6 py-12"
            >
              <div className="mb-12">
                <h2 className="text-4xl font-display font-bold text-brand-primary">Configurá tu Perfil</h2>
                <p className="text-slate-500 mt-2">Personalizá cómo te ven los clientes en OficioCerca.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const occupations = Array.from(formData.getAll('occupations') as string[]);
                  handleUpdateProfile({
                    name: formData.get('name') as string,
                    isWorker: formData.get('isWorker') === 'on',
                    department: formData.get('department') as string,
                    city: formData.get('city') as string,
                    phone: formData.get('phone') as string,
                    experience: parseInt(formData.get('experience') as string) || 0,
                    description: formData.get('description') as string,
                    occupations,
                    priceRange: formData.get('priceRange') as any,
                  });
                }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                      <input 
                        name="name"
                        defaultValue={profile.name}
                        required
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teléfono de Contacto</label>
                      <input 
                        name="phone"
                        defaultValue={profile.phone}
                        placeholder="+54 9 351 ..."
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input 
                      type="checkbox"
                      name="isWorker"
                      defaultChecked={profile.isWorker}
                      id="isWorker"
                      className="w-5 h-5 rounded border-slate-300 text-brand-cta focus:ring-brand-cta"
                    />
                    <label htmlFor="isWorker" className="font-bold text-brand-primary">Quiero ofrecer mis servicios (Perfil Trabajador)</label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departamento</label>
                      <select 
                        name="department"
                        value={editDept}
                        onChange={(e) => {
                          setEditDept(e.target.value);
                          setEditCity('');
                        }}
                        required
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm"
                      >
                        <option value="">Seleccionar Departamento...</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Localidad</label>
                      <select 
                        name="city"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        required
                        disabled={!editDept}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm disabled:opacity-50"
                      >
                        <option value="">Seleccionar Ciudad...</option>
                        {editDept && CITIES_BY_DEPARTMENT[editDept]?.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Oficios (Mantené Ctrl para seleccionar varios)</label>
                    <select 
                      name="occupations"
                      multiple
                      defaultValue={profile.occupations}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm min-h-[200px]"
                    >
                      {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Años de Experiencia</label>
                      <input 
                        type="number"
                        name="experience"
                        defaultValue={profile.experience}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nivel de Precio</label>
                      <select 
                        name="priceRange"
                        defaultValue={profile.priceRange}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm"
                      >
                        <option value="Economic">Económico</option>
                        <option value="Standard">Estándar</option>
                        <option value="Premium">Premium / Especializado</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Descripción de Servicios</label>
                    <textarea 
                      name="description"
                      defaultValue={profile.description}
                      rows={5}
                      placeholder="Contanos sobre tu experiencia, herramientas, forma de trabajo..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/20 focus:border-brand-cta transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-brand-cta text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                  >
                    Guardar Cambios
                  </button>
                  <button 
                    type="button"
                    onClick={() => setView('HOME')}
                    className="px-8 h-14 bg-white text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'LOGIN' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center min-h-[calc(100vh-64px)]"
            >
              <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full text-center space-y-8">
                <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 mx-auto">
                  <Hammer size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-brand-primary">¡Bienvenido!</h2>
                  <p className="text-slate-500 mt-2">Unite a la comunidad de trabajadores más grande de Córdoba.</p>
                </div>
                <button 
                  onClick={async () => {
                    await loginWithGoogle();
                    setView('HOME');
                  }}
                  className="w-full flex items-center justify-center gap-4 py-4 border-2 border-slate-200 rounded-2xl font-bold bg-white hover:bg-slate-50 transition-all active:scale-95"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  Ingresar con Google
                </button>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Autenticación segura vía Google
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white">
              <Hammer size={16} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">OficioCerca</span>
          </div>
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} OficioCerca Córdoba. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-slate-400 text-sm font-medium">
            <button onClick={() => setShowTerms(true)} className="hover:text-brand-accent transition-colors cursor-pointer">Términos</button>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-brand-accent transition-colors cursor-pointer">Privacidad</button>
            <a href="mailto:oficioscerca@gmail.com" className="hover:text-brand-accent transition-colors">Contacto</a>
          </div>
        </div>
      </footer>

      {/* Botón Flotante de Ayuda / ChatBot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!showHelp && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 text-brand-primary text-xs font-bold whitespace-nowrap mb-2 relative"
            >
              ¡Hola! ¿Necesitás ayuda?
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowHelp(true)}
          className="w-16 h-16 bg-brand-cta text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer active:scale-95 group"
          title="¿Cómo usar OficioCerca?"
        >
          <motion.div
            animate={showHelp ? { rotate: 90, scale: 0.8 } : { rotate: 0, scale: 1 }}
          >
            <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
          </motion.div>
        </button>
      </div>

      {/* Modal de Ayuda / ChatBot */}
      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[105]"
              onClick={() => setShowHelp(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="fixed bottom-24 right-6 z-[110] w-[90vw] sm:w-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-brand-primary p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                    <Hammer size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg">Guía OficioCerca</h4>
                    <p className="text-brand-accent text-[10px] uppercase tracking-widest font-bold">Asistente en línea</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 text-slate-600 custom-scrollbar">
                <div className="space-y-6">
                  {/* Bubble 1: Welcome */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-brand-primary">
                      <Hammer size={16} />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 text-sm font-bold text-brand-primary">
                      ¡Ya puedes empezar a usar OficioCerca! Es muy sencillo. Aquí tienes los pasos principales:
                    </div>
                  </div>

                  {/* Bubble 2: Cliente */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-brand-primary">
                      <UserIcon size={16} />
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-none border border-slate-100 space-y-3">
                      <h5 className="font-bold text-brand-cta flex items-center gap-2 text-sm uppercase tracking-wider">
                        1. Si buscas un profesional
                      </h5>
                      <ul className="space-y-2 text-xs leading-relaxed">
                        <li className="flex gap-2">
                          <span className="text-brand-cta font-bold">•</span>
                          <span>Seleccioná el <strong>Departamento</strong> y la <strong>Ciudad</strong>.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-brand-cta font-bold">•</span>
                          <span>Buscá por el <strong>Oficio</strong> y hacé clic en "Buscar".</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-brand-cta font-bold">•</span>
                          <span>Entrá al perfil del experto y contactalo por <strong>WhatsApp</strong>.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Bubble 3: Trabajador */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-brand-primary">
                      <Briefcase size={16} />
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-none border border-slate-100 space-y-3">
                      <h5 className="font-bold text-emerald-500 flex items-center gap-2 text-sm uppercase tracking-wider">
                        2. Si ofrecés tus servicios
                      </h5>
                      <ul className="space-y-2 text-xs leading-relaxed">
                        <li className="flex gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>Hacé clic en <strong>"Ingresar"</strong> con tu cuenta de Google.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>En <strong>"Mi Perfil"</strong> activá la casilla de "Trabajador".</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>Elegí tus oficios, agregá tu teléfono y descripción.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>Guardá los cambios y ¡empezá a recibir clientes!</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 italic text-[11px] space-y-2 text-slate-400">
                    <p><strong>Contacto:</strong> <a href="mailto:oficioscerca@gmail.com" className="text-brand-cta underline">oficioscerca@gmail.com</a>.</p>
                    <p><strong>Seguridad:</strong> Plataforma de contacto. Recomendamos verificar referencias antes de contratar.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg active:scale-95"
                >
                  ¡Entendido! Empezar ahora
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modales Legales */}
      <AnimatePresence>
        {(showTerms || showPrivacy) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => { setShowTerms(false); setShowPrivacy(false); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 md:p-12 relative"
            >
              <button 
                onClick={() => { setShowTerms(false); setShowPrivacy(false); }}
                className="absolute top-6 right-6 text-slate-400 hover:text-brand-primary"
              >
                Cerrar
              </button>

              {showTerms ? (
                <div className="space-y-6">
                  <h3 className="text-3xl font-display font-bold text-brand-primary">Términos y Condiciones</h3>
                  <div className="space-y-4 text-slate-600 leading-relaxed">
                    <p>Bienvenido a OficioCerca. Al utilizar este servicio, usted acepta cumplir con las leyes vigentes de la República Argentina.</p>
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium italic">
                      "El creador y los administradores de esta plataforma no se hacen responsables por ningún tipo de delito, estafa, daño o perjuicio derivado de la contratación o interacción entre usuarios."
                    </div>
                    <p>OficioCerca es puramente un directorio de contacto. No certificamos la veracidad de los datos ni la calidad del trabajo. Cada usuario es responsable de verificar la identidad y referencias de la persona que contrata.</p>
                    <p>Este sitio se rige por todas las leyes de la República Argentina aplicables al comercio electrónico y servicios digitales.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-3xl font-display font-bold text-brand-primary">Política de Privacidad</h3>
                  <div className="space-y-4 text-slate-600 leading-relaxed">
                    <p>En cumplimiento con la Ley 25.326 de Protección de Datos Personales en Argentina, le informamos:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>No recolectamos datos sensibles:</strong> Solo almacenamos la información que usted decide publicar en su perfil (Nombre, Foto, Teléfono, Oficio).</li>
                      <li><strong>Uso de la información:</strong> Sus datos se utilizan exclusivamente para permitir que clientes potenciales lo encuentren dentro de la provincia de Córdoba.</li>
                      <li><strong>Seguridad:</strong> Utilizamos Firebase (Google) para garantizar que nadie pueda acceder a su configuración de perfil sin su cuenta de Google.</li>
                      <li><strong>Derechos:</strong> Usted puede eliminar su cuenta y sus datos en cualquier momento desde la configuración de su perfil.</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
