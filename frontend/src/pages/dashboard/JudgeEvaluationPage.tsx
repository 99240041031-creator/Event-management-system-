import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Trophy, ExternalLink, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const mockTeams = [
  {
    id: 1,
    name: "CodeCrafters",
    project: "AI Innovation Challenge",
    members: 3,
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "DesignMinds",
    project: "Web3 Builders Hack",
    members: 2,
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Nexus Builders",
    project: "Smart Traffic System",
    members: 4,
    status: "PENDING"
  }
];

const JudgeEvaluationPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const filteredTeams = mockTeams.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                        Evaluate <span className="text-primary">Teams</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Select a team to review their submissions and assign marks.</p>
                </div>
                <div className="w-full md:w-64 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="SEARCH TEAMS..." 
                        className="pl-10 rounded-xl h-12 bg-white dark:bg-slate-900 border-none shadow-sm font-bold text-xs uppercase"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTeams.map((team, index) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/judge/team/${team.id}`)}
                        className="cursor-pointer group"
                    >
                        <Card className="rounded-3xl border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden hover:ring-2 ring-primary/30 transition-all p-8 relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="h-10 w-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                                    {team.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-3 w-3 text-[hsl(var(--teal))]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        {team.project}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roster Count</span>
                                    <span className="text-lg font-black">{team.members} Members</span>
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {team.status}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredTeams.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No teams found matching your search</p>
                </div>
            )}
        </div>
    );
};

export default JudgeEvaluationPage;

