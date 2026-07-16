import { useEffect, useRef, useState } from 'react';
import {
  Linkedin,
  Github,
  Mail,
  ChevronDown,
  Code,
  Rocket,
  Lightbulb,
  Globe,
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─── Animated Particles Canvas ─── */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Reveal Wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="text-xl font-bold text-gradient tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          RG.
        </span>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Chi Sono', id: 'about' },
            { label: 'Servizi', id: 'services' },
            { label: 'Contatti', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-white/60 hover:text-cyan-400 transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
          <Button
            size="sm"
            className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
            onClick={() => scrollTo('contact')}
          >
            Contattami
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="./hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 glass rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Benvenuto nel mio spazio</span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-8 relative inline-block">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-cyan-500/40 glow-cyan mx-auto">
              <img
                src="./hero-profile.jpg"
                alt="Raphael Guido"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-background">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
            <span className="text-white">Raphael</span>{' '}
            <span className="text-gradient">Guido</span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="text-xl md:text-2xl text-white/60 mb-4 font-light">
            IT Consultant & Digital Strategist
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex items-center justify-center gap-2 text-white/40 mb-10">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Puglia, Italy</span>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 glow-cyan-sm group"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Iniziamo un Progetto
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Scopri di Più
            </Button>
          </div>
        </Reveal>

        <Reveal delay={700}>
          <div className="mt-16 flex items-center justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/rraphaelguido001/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-white/60 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="https://github.com/Rapha987"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <Github className="w-5 h-5 text-white/60 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="mailto:raphaelguido@email.com"
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-white/60 group-hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function About() {
  const stats = [
    { value: '5+', label: 'Anni di Esperienza' },
    { value: '50+', label: 'Progetti Completati' },
    { value: '30+', label: 'Clienti Soddisfatti' },
    { value: '100%', label: 'Passione & Impegno' },
  ];

  return (
    <section id="about" className="relative py-32 z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Chi Sono</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
              Trasformo idee in <span className="text-gradient">realtà digitali</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <Reveal delay={100}>
            <div className="space-y-6">
              <p className="text-lg text-white/70 leading-relaxed">
                Sono Raphael Guido, un consulente IT e stratega digitale con sede in Puglia.
                Aiuto aziende e professionisti a navigare il mondo digitale con soluzioni
                tecnologiche su misura.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Dal trasporto all'e-commerce, dall'automazione alla consulenza strategica —
                trasformo ogni sfida in un'opportunità di crescita. Il mio approccio unisce
                creatività, tecnica e visione imprenditoriale.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Credo nel potere dell'innovazione Made in Italy e lavoro ogni giorno per
                portare il Sud Italia al centro della scena digitale europea.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="text-3xl md:text-4xl font-black text-gradient mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
function Services() {
  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Sviluppo Web & App',
      description: 'Siti web moderni, e-commerce e applicazioni web su misura. Stack tecnologici all\'avanguardia per risultati che impressionano.',
      tags: ['React', 'TypeScript', 'Node.js'],
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Consulenza IT Strategica',
      description: 'Analisi, pianificazione e implementazione di soluzioni tecnologiche per ottimizzare processi aziendali e accelerare la crescita.',
      tags: ['Digital Transformation', 'Cloud', 'Automation'],
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Digital Strategy',
      description: 'Dalla brand identity al marketing digitale. Costruisco strategie complete per far decollare la tua presenza online.',
      tags: ['SEO', 'Social Media', 'Branding'],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'E-Commerce Solutions',
      description: 'Negozi online ottimizzati per le conversioni. Integrazione pagamenti, logistica e gestione inventario automatizzata.',
      tags: ['Shopify', 'WooCommerce', 'Custom'],
    },
  ];

  return (
    <section id="services" className="relative py-32 z-10 bg-black/30">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Cosa Faccio</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
              Servizi <span className="text-gradient">Premium</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              Soluzioni complete per il tuo business digitale. Dall'idea al deploy, ti accompagno in ogni fase.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="glass rounded-2xl p-8 h-full hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-500 group cursor-pointer">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ─── */
function Contact() {
  return (
    <section id="contact" className="relative py-32 z-10">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Contatti</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
              Costruiamo qualcosa di <span className="text-gradient">epico</span> insieme
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Hai un progetto in mente? Scrivimi e vediamo come posso aiutarti a realizzarlo.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/rraphaelguido001/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#0077b5]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-7 h-7 text-[#0077b5]" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">LinkedIn</div>
                  <div className="text-sm text-white/50">/in/rraphaelguido001</div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Rapha987"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Github className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">GitHub</div>
                  <div className="text-sm text-white/50">/Rapha987</div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
              </a>

              {/* Email */}
              <a
                href="mailto:raphaelguido@email.com"
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white mb-1">Email</div>
                  <div className="text-sm text-white/50">Scrivimi ora</div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
              </a>
            </div>

            <div className="mt-10 text-center">
              <p className="text-white/40 text-sm">
                Basato in <span className="text-white/60">Puglia, Italy</span> — Opero in tutta Italia e in remoto worldwide 🌍
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/30 text-sm">
          © 2025 Raphael Guido. Tutti i diritti riservati.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/rraphaelguido001/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-cyan-400 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Rapha987"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-cyan-400 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main App ─── */
function App() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
