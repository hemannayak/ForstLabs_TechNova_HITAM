import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Map,
  Users,
  CheckCircle,
  Smartphone,
  Zap,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

// Stats Counter Component with Scroll Trigger
const StatsCounter: React.FC<StatsCounterProps> = ({ value, label, suffix = '', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;
    let timer: any;

    const startAnimation = setTimeout(() => {
      timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);
    }, delay * 1000);

    return () => {
      clearTimeout(startAnimation);
      if (timer) clearInterval(timer);
    };
  }, [value, delay, isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { issues } = useApp();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  // Mock data for display potential
  const activeCitizens = 500 + new Set(issues.map(i => i.reportedBy)).size;
  const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : '92';

  const steps = [
    {
      icon: Camera,
      title: "Snap a Photo",
      desc: "Spot an issue? Take a picture. Our AI instantly analyzes it for category and severity."
    },
    {
      icon: Zap,
      title: "AI Analysis",
      desc: "CivicSense verifies the report and routes it to the correct department automatically."
    },
    {
      icon: Map,
      title: "Track & Solve",
      desc: "Authorities are notified. You can track progress in real-time on the live map."
    },
    {
      icon: Award,
      title: "Earn Rewards",
      desc: "Issue resolved! You earn points and climb the community leaderboard."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-16">

        {/* Animated Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <motion.img
            src="/hero-hyderabad.png"
            alt="Hyderabad Smart City"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 10, ease: "linear" }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900 z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-indigo-200 text-sm font-medium">Live in Hyderabad</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-tight">
              Transform Your City, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">One Snap at a Time.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the movement to keep your neighborhood clean and safe.
              Report issues instanty, track real-time progress, and earn rewards for your impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/report" className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 hover:shadow-indigo-600/40 ring-1 ring-white/10 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Report an Issue <Camera className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link to="/map" className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all hover:scale-105 flex items-center">
                View Live Map <Map className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating UI Elements (Decorative) */}
        <motion.div style={{ y: y2 }} className="absolute md:block hidden right-[5%] top-[20%] bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-64 shadow-2xl z-0 rotate-6 hover:scale-105 transition-transform duration-300 cursor-default">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Pothole Fixed!</div>
              <div className="text-slate-400 text-xs">Jubilee Hills • 2m ago</div>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-full bg-green-500"></div>
          </div>
        </motion.div>

        <motion.div style={{ y: y1 }} className="absolute md:block hidden left-[5%] bottom-[20%] bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-64 shadow-2xl z-0 -rotate-6 hover:scale-105 transition-transform duration-300 cursor-default">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">New Champion</div>
              <div className="text-slate-400 text-xs">Top Contributor Award</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS TICKER */}
      <section className="bg-indigo-900 py-12 border-b border-indigo-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCounter value={totalIssues + 1200} label="Issues Detected" suffix="+" delay={0} />
            <StatsCounter value={activeCitizens} label="Active Citizens" suffix="+" delay={0.2} />
            <StatsCounter value={98} label="Coverage Area" suffix="%" delay={0.4} />
            <StatsCounter value={parseInt(resolutionRate)} label="Resolution Rate" suffix="%" delay={0.6} />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Why CivicSense?</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Smart Tools for a Better City</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">We combine cutting-edge AI technology with community power to solve urban challenges faster and more efficiently.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Precision AI Analysis",
                text: "Our advanced Vision API instantly identifies, categorizes, and assesses severity of issues from a single photo.",
                color: "bg-blue-500"
              },
              {
                icon: Map,
                title: "Hyper-Local Tracking",
                text: "View real-time heatmaps of issues in your ward. Track resolution status transparently on the live map.",
                color: "bg-indigo-500"
              },
              {
                icon: Users,
                title: "Community Driven",
                text: "Validate other reports, vote on priorities, and work together to demand faster action from authorities.",
                color: "bg-purple-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-32 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Simple Process</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">From Snap to Solution</h3>
              <p className="text-xl text-slate-600 mb-10">Reporting civic issues shouldn't be complicated. We've streamlined the entire workflow into 4 simple steps.</p>

              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {idx + 1}
                      </div>
                      {idx !== steps.length - 1 && (
                        <div className="absolute top-14 left-6 w-px h-10 bg-indigo-100"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                        {step.title}
                      </h4>
                      <p className="text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link to="/auth" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700 hover:translate-x-1 transition-all">
                  Sign up to start reporting <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
              <div className="bg-slate-900 rounded-3xl p-2 shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500 border border-slate-800">
                <div className="bg-slate-800 rounded-2xl overflow-hidden aspect-[4/3] relative group">
                  <img
                    src="/community-reporting.png"
                    alt="Community Reporting in Hyderabad"
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group-hover:bg-indigo-600/80">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                  </div>

                  {/* Floating Notification */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-white font-medium">Issue Resolved</span>
                      </div>
                      <span className="text-indigo-200 text-sm">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP PROMO */}
      <section className="bg-indigo-900 overflow-hidden py-24 relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-indigo-800/50 backdrop-blur-sm rounded-[3rem] p-12 md:p-20 border border-indigo-700/50 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">CivicSense in Your Pocket</h2>
              <p className="text-xl text-indigo-100 mb-8">
                Download our mobile app for on-the-go reporting, instant notifications, and location-based alerts. Available for iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-50 transition-colors hover:scale-105 active:scale-95 duration-200">
                  <Smartphone className="w-5 h-5 mr-2" /> App Store
                </button>
                <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-white/10 transition-colors hover:scale-105 active:scale-95 duration-200">
                  <Smartphone className="w-5 h-5 mr-2" /> Play Store
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Simplified Phone Mockup */}
              <div className="w-64 h-[500px] border-8 border-slate-900 rounded-[3rem] bg-indigo-950 shadow-2xl overflow-hidden relative group hover:-translate-y-4 transition-transform duration-500">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-32 mx-auto z-20"></div>
                <img
                  src="/app-mockup.png"
                  alt="App Screen"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent p-6 text-white z-10">
                  <div className="font-bold">Report Submitted</div>
                  <div className="text-xs text-gray-300">Thank you for your contribution!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;