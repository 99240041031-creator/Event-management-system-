import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowLeft, Info, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RiskCompliance = () => {
    const navigate = useNavigate();

    const risks = [
        { id: 1, type: 'FINANCIAL', severity: 'HIGH', message: 'Club "Tech Innovators" exceeded monthly budget by 15%', status: 'UNRESOLVED' },
        { id: 2, type: 'ENGAGEMENT', severity: 'MEDIUM', message: 'Student participation dropped 10% in Year 3', status: 'MONITORING' },
        { id: 3, type: 'COMPLIANCE', severity: 'LOW', message: '2 faculty members pending report submission', status: 'RESOLVED' },
    ];

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/hod')} className="text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Suite
                </Button>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-red-500 w-8 h-8" />
                        Risk & Compliance Sentinel
                    </h1>
                    <p className="text-gray-500 mt-1">Automated threat detection and departmental compliance monitoring.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {risks.map((risk, index) => (
                    <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`bg-gray-900/60 border-gray-800 border-l-4 ${risk.severity === 'HIGH' ? 'border-l-red-600' :
                                risk.severity === 'MEDIUM' ? 'border-l-amber-500' : 'border-l-blue-500'
                            }`}>
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${risk.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' :
                                            risk.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{risk.type}</span>
                                            <Badge variant="outline" className="text-[10px] uppercase border-gray-800">{risk.severity} Severity</Badge>
                                        </div>
                                        <p className="text-gray-200 mt-1 font-medium">{risk.message}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        className={risk.status === 'UNRESOLVED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            risk.status === 'MONITORING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                "bg-green-500/10 text-green-500 border-green-500/20"}
                                    >
                                        {risk.status}
                                    </Badge>
                                    <Button size="sm" variant="outline" className="border-gray-800">Review</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RiskCompliance;
