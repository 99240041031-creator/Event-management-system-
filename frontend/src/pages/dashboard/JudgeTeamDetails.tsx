import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Trophy, 
  Github, 
  ExternalLink,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Mock data matching dashboard with extended details
const mockTeams = [
  {
    id: 1,
    name: "CodeCrafters",
    project: "AI Innovation Challenge",
    description: "Developing a decentralized AI orchestration layer for multi-agent systems.",
    members: ["John Doe (Lead)", "Alice Smith", "Bob Johnson"],
    status: "ACTIVE",
    files: [
      { name: "Project Architecture.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      { name: "Technical Pitch.mp4", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ],
    repo: "github.com/codecrafters/nexus-ai",
    demo: "nexus-ai.io"
  },
  {
    id: 2,
    name: "DesignMinds",
    project: "Web3 Builders Hack",
    description: "A comprehensive design system for dApps with accessibility-first primitives.",
    members: ["Sam Wilson (Lead)", "Emma Davis"],
    status: "ACTIVE",
    files: [
      { name: "Figma System Design", url: "https://figma.com" },
      { name: "Presentation Slides", url: "https://slides.google.com" }
    ],
    repo: "github.com/designminds/web3-ui",
    demo: "web3-ui-kit.vercel.app"
  },
  {
    id: 3,
    name: "Nexus Builders",
    project: "Smart Traffic System",
    description: "AI-powered urban mobility platform optimizing traffic flow through real-time edge processing.",
    members: ["Ananya Singh (Lead)", "Rahul Kumar"],
    status: "ACTIVE",
    files: [
      { name: "System Architecture.pdf", url: "https://example.com/sample.pdf" },
      { name: "Demo Video", url: "https://youtube.com/" }
    ],
    repo: "github.com/nexusbuilders/smart-city",
    demo: "nexus-traffic.io"
  }
];

const JudgeTeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [roundScores, setRoundScores] = useState({ round1: "", round2: "", round3: "" });

  const judgeId = user?.id || user?.email || "anonymous_judge";

  console.log("Evaluation Hub Access:", { teamId, judgeId });

  const team = mockTeams.find(t => t.id === Number(teamId));

  useEffect(() => {
    if (team) {
      try {
        const savedData = localStorage.getItem("judgeTeamScores");
        const allScores = savedData ? JSON.parse(savedData) : {};
        
        // Load independent score for CURRENT judge
        const currentJudgeScores = allScores[team.id]?.[judgeId];
        
        if (currentJudgeScores) {
          setRoundScores(currentJudgeScores);
        } else {
          setRoundScores({ round1: "", round2: "", round3: "" });
        }
      } catch (error) {
        console.error("Failed to load judge context:", error);
      }
    }
  }, [team, judgeId]);

  const handleScoreChange = (round: keyof typeof roundScores, value: string) => {
    setRoundScores(prev => ({ ...prev, [round]: value }));
  };

  const calculateTotal = () => {
    return (Number(roundScores.round1) || 0) + 
           (Number(roundScores.round2) || 0) + 
           (Number(roundScores.round3) || 0);
  };

  const handleSave = () => {
    if (!team) return;
    try {
      const savedData = localStorage.getItem("judgeTeamScores");
      const allScores = savedData ? JSON.parse(savedData) : {};
      
      if (!allScores[team.id]) {
        allScores[team.id] = {};
      }

      // Save independent score for CURRENT judge without overwriting others
      allScores[team.id][judgeId] = roundScores;

      localStorage.setItem("judgeTeamScores", JSON.stringify(allScores));
      toast.success(`Evaluation by ${user?.firstName || 'Judge'} saved successfully`);
    } catch (error) {
      console.error("Critical save failure:", error);
      toast.error("Cloud-sync simulation failed. Check local storage capacity.");
    }
  };

  const handleViewFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldAlert className="h-16 w-16 text-yellow-500" />
        <h1 className="text-2xl font-bold">Team {teamId} Not Found</h1>
        <Button onClick={() => navigate('/dashboard/judge')}>Return to Console</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/judge')}
        className="group hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Team {team?.name}
            </h1>
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
              {team?.status}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground font-medium">{team?.project}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleViewFile(`https://${team?.repo || ''}`)}>
            <Github className="mr-2 h-4 w-4" /> Repo
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleViewFile(`https://${team?.demo || ''}`)}>
            <ExternalLink className="mr-2 h-4 w-4" /> Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Project Abstract */}
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Project Abstract
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                {team?.description}
              </p>
            </CardContent>
          </Card>

          {/* Submitted Files */}
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Submitted Deliverables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3">
                {team?.files?.map((file, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{file.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewFile(file.url)} className="rounded-xl text-xs uppercase font-black tracking-widest px-4 h-8">
                      View Asset
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Scoring Console */}
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-950 text-white overflow-hidden ring-4 ring-primary/20">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                <Trophy className="h-4 w-4" />
                Evaluation Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Round 1</label>
                    <Input
                    type="number"
                    placeholder="00"
                    className="h-12 bg-white/5 border-white/10 text-white text-xl font-black rounded-xl focus:ring-primary focus:border-primary text-center"
                    value={roundScores.round1}
                    onChange={(e) => handleScoreChange('round1', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Round 2</label>
                    <Input
                    type="number"
                    placeholder="00"
                    className="h-12 bg-white/5 border-white/10 text-white text-xl font-black rounded-xl focus:ring-primary focus:border-primary text-center"
                    value={roundScores.round2}
                    onChange={(e) => handleScoreChange('round2', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Round 3</label>
                    <Input
                    type="number"
                    placeholder="00"
                    className="h-12 bg-white/5 border-white/10 text-white text-xl font-black rounded-xl focus:ring-primary focus:border-primary text-center"
                    value={roundScores.round3}
                    onChange={(e) => handleScoreChange('round3', e.target.value)}
                    />
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Aggregate</span>
                    <span className="text-2xl font-black text-primary">{calculateTotal()} <span className="text-sm font-medium text-slate-500">/ 300</span></span>
                </div>
                <Button onClick={handleSave} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                    Seal Marks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Team Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {team?.members?.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                      {member?.[0] || '?'}
                    </div>
                    <span className="font-bold text-sm">{member}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JudgeTeamDetails;
