import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { judgeService, type JudgeStats } from '@/services/judgeService';
import { Button } from '@/components/ui/button';

const JudgeDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assignedEvents, setAssignedEvents] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      // READ EVENTS DATA
      const storedEvents = JSON.parse(localStorage.getItem("assigned_events") || "[]");
      setAssignedEvents(storedEvents);

      // READ EVALUATIONS
      const keys = Object.keys(localStorage);
      const evals = keys
        .filter((key) => key.startsWith("evaluation_"))
        .map((key) => {
          try {
            return JSON.parse(localStorage.getItem(key) || "{}");
          } catch {
            return {};
          }
        })
        .filter(ev => !ev.isDraft); // Only count finalized evaluations

      setEvaluations(evals);
    };

    updateStats();
    
    // Listen for changes (cross-tab or same-tab dispatch)
    window.addEventListener("storage", updateStats);
    return () => window.removeEventListener("storage", updateStats);
  }, []);

  const assignedCount = assignedEvents.length || 3; // Fallback to 3 if empty but mock exists
  const completedCount = evaluations.length;
  const pendingCount = Math.max(0, assignedCount - completedCount);

  const statCards = [
    {
      title: 'Assigned Events',
      value: assignedCount,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/dashboard/judge/events'
    },
    {
      title: 'Pending Evaluations',
      value: pendingCount,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/dashboard/judge/events'
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '#' // Add history link if needed
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome, {user?.firstName || 'Judge'}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Project Assessment Command Center — Monitoring <span className="text-foreground font-bold">{pendingCount}</span> active submissions.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/dashboard/judge/events')} className="rounded-xl h-12 font-bold px-6">
            View Assigned Events
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all cursor-pointer shadow-xl shadow-slate-200/50 dark:shadow-none group"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</h3>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default JudgeDashboard;
