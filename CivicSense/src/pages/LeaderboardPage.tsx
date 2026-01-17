import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

const LeaderboardPage: React.FC = () => {
  const { issues } = useApp();

  // Create real-time user statistics from issues data
  const realTimeUsers = useMemo(() => {
    const userStats = new Map<string, { id: string; username: string; reportsCount: number; validationScore: number; badges: string[] }>();

    // Initialize with mock users
    mockUsers.forEach(user => {
      userStats.set(user.username, {
        id: user.id,
        username: user.username,
        reportsCount: user.reportsCount,
        validationScore: user.validationScore,
        badges: user.badges
      });
    });

    // Update with real-time data from issues
    issues.forEach(issue => {
      const existingUser = userStats.get(issue.reportedBy);
      if (existingUser) {
        existingUser.reportsCount += 1;
        existingUser.validationScore += 10;
      } else {
        userStats.set(issue.reportedBy, {
          id: `user_${issue.reportedBy}`,
          username: issue.reportedBy,
          reportsCount: 1,
          validationScore: 10,
          badges: ['New Contributor']
        });
      }
    });

    // Simple badge logic
    userStats.forEach(user => {
      const badges = [];
      if (user.reportsCount >= 20) badges.push('Top Reporter');
      if (user.reportsCount >= 10) badges.push('Guardian');
      if (user.reportsCount >= 5) badges.push('Active');
      user.badges = badges.length > 0 ? badges : ['Newcomer'];
    });

    return Array.from(userStats.values())
      .filter(user => user.username !== 'admin_user' && user.username !== 'Anonymous User')
      .sort((a, b) => b.validationScore - a.validationScore);
  }, [issues]);

  const topThree = realTimeUsers.slice(0, 3);
  const restUsers = realTimeUsers.slice(3);

  return (
    <div className="relative min-h-screen bg-slate-50/50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-in fade-in duration-1000"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-10 animate-in fade-in duration-1000 delay-300"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-32 animate-in slide-in-from-top-10 duration-700 fade-in flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-indigo-100 mb-6">
            <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Live Rankings</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Champions</span>
          </h1>

          {/* Duplicate crown removed. Spacing increased to prevent overlap with podium crown. */}

          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Celebrating the heroes transforming our city one report at a time.
          </p>
        </div>

        {/* Podium Section - Perfectly Aligned */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8 mb-24 px-4 h-[440px]">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-1/3 animate-in slide-in-from-bottom-12 duration-700 delay-100 fade-in fill-mode-both">
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-indigo-100 rounded-full rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                <div className="w-24 h-24 bg-white border-4 border-white shadow-xl rounded-full flex items-center justify-center text-3xl font-bold text-slate-700 relative z-10 overflow-hidden">
                  <span className="transform group-hover:scale-110 transition-transform">{topThree[1].username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20 border-2 border-white">
                  2nd Place
                </div>
              </div>
              <div className="text-center mb-3">
                <div className="font-bold text-slate-900 text-lg truncate max-w-[120px]">{topThree[1].username}</div>
                <div className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm inline-block">{topThree[1].validationScore} pts</div>
              </div>
              <div className="w-full h-40 bg-gradient-to-b from-slate-100 to-white/50 rounded-t-3xl shadow-lg border-t border-white/50 relative overflow-hidden group-hover:from-slate-200 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>
                <div className="flex flex-col items-center justify-center h-full text-slate-400 font-black text-7xl opacity-50">2</div>
              </div>
            </div>
          )}

          {/* 1st Place - Winner */}
          {topThree[0] && (
            <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-1/3 z-10 animate-in slide-in-from-bottom-16 duration-700 delay-200 fade-in fill-mode-both">
              <div className="relative group mb-6 scale-110">
                {/* Fixed Crown Centering and Spacing */}
                <div className="absolute -top-16 left-0 right-0 flex justify-center animate-bounce duration-[2000ms] z-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 drop-shadow-xl"
                  >
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-md opacity-50 group-hover:opacity-80 transition duration-500"></div>
                <div className="w-32 h-32 bg-white border-4 border-yellow-400 shadow-2xl ring-4 ring-yellow-100 rounded-full flex items-center justify-center text-5xl font-extrabold text-indigo-900 relative z-10 overflow-hidden">
                  <span className="transform group-hover:scale-110 transition-transform bg-gradient-to-br from-indigo-900 to-violet-800 bg-clip-text text-transparent">{topThree[0].username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-xl z-20 border-2 border-white">
                  Winner
                </div>
              </div>
              <div className="text-center mb-4 transform scale-110">
                <div className="font-extrabold text-slate-900 text-xl truncate max-w-[150px]">{topThree[0].username}</div>
                <div className="text-amber-600 font-extrabold text-lg bg-amber-50 px-4 py-1 rounded-full inline-block mt-1 shadow-sm">{topThree[0].validationScore} pts</div>
              </div>
              <div className="w-full h-56 bg-gradient-to-b from-yellow-50 to-white/50 rounded-t-[2.5rem] shadow-2xl border-t-2 border-yellow-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-yellow-400/10 to-transparent"></div>
                <div className="flex flex-col items-center justify-center h-full text-yellow-600 font-black text-9xl opacity-30 drop-shadow-sm">1</div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="order-3 flex flex-col items-center w-full md:w-1/3 animate-in slide-in-from-bottom-8 duration-700 delay-300 fade-in fill-mode-both">
              <div className="relative group mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full rotate-[-6deg] group-hover:rotate-[-12deg] transition-transform duration-500"></div>
                <div className="w-24 h-24 bg-white border-4 border-white shadow-xl rounded-full flex items-center justify-center text-3xl font-bold text-orange-900 relative z-10 overflow-hidden">
                  <span className="transform group-hover:scale-110 transition-transform">{topThree[2].username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-orange-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20 border-2 border-white">
                  3rd Place
                </div>
              </div>
              <div className="text-center mb-3">
                <div className="font-bold text-slate-900 text-lg truncate max-w-[120px]">{topThree[2].username}</div>
                <div className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm inline-block">{topThree[2].validationScore} pts</div>
              </div>
              <div className="w-full h-32 bg-gradient-to-b from-orange-50 to-white/50 rounded-t-3xl shadow-lg border-t border-white/50 relative overflow-hidden group-hover:from-orange-100 transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-50"></div>
                <div className="flex flex-col items-center justify-center h-full text-orange-400 font-black text-7xl opacity-50">3</div>
              </div>
            </div>
          )}
        </div>

        {/* Remaining List Section - Modern Glass Cards */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-4 mb-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span>Rank & Contributor</span>
            <span>Performance</span>
          </div>

          {restUsers.map((user, index) => {
            const rank = index + 4;
            return (
              <div
                key={user.id}
                className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-sm border border-white/50 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4 fill-mode-both overflow-hidden"
                style={{ animationDelay: `${index * 50 + 400}ms` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                <div className="flex items-center space-x-6">
                  <span className="text-lg font-bold text-slate-400 w-8 text-center group-hover:text-indigo-600 transition-colors">#{rank}</span>

                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300 shadow-inner">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-lg">{user.username}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {user.badges.map((badge, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8 pr-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reports</p>
                    <p className="font-bold text-slate-700">{user.reportsCount}</p>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
                    <p className="text-2xl font-black text-indigo-600 group-hover:scale-110 transition-transform origin-right drop-shadow-sm">{user.validationScore}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {restUsers.length === 0 && (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No more users found. Start contributing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;