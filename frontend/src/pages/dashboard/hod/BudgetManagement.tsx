import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, PieChart, TrendingUp, ArrowLeft, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const BudgetManagement = () => {
    const navigate = useNavigate();

    const budgets = [
        { name: 'Technical Events', allocated: 50000, spent: 32000, color: 'bg-blue-500' },
        { name: 'Club Operations', allocated: 20000, spent: 18000, color: 'bg-purple-500' },
        { name: 'Research projects', allocated: 100000, spent: 45000, color: 'bg-green-500' },
    ];

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard/hod')} className="text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Suite
                </Button>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Wallet className="text-green-500 w-8 h-8" />
                        Fiscal Management
                    </h1>
                    <p className="text-gray-500 mt-1">Departmental budget allocation and expenditure oversight.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-gray-800 text-gray-400">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                        <Plus className="w-4 h-4 mr-2" /> New Allocation
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader><CardTitle className="text-sm text-gray-500 uppercase tracking-widest">Total Capital</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-black text-white">$170,000</p></CardContent>
                </Card>
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader><CardTitle className="text-sm text-gray-500 uppercase tracking-widest">Total Spent</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-black text-blue-400">$95,000</p></CardContent>
                </Card>
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader><CardTitle className="text-sm text-gray-500 uppercase tracking-widest">Available Balance</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-black text-green-400">$75,000</p></CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Stream-wise Allocation</h2>
                {budgets.map((b, index) => (
                    <motion.div
                        key={b.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-gray-900/60 border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex justify-between mb-4 items-end">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{b.name}</h3>
                                        <p className="text-xs text-gray-500">Utilization: {((b.spent / b.allocated) * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-mono font-bold">${b.spent.toLocaleString()} / ${b.allocated.toLocaleString()}</p>
                                    </div>
                                </div>
                                <Progress value={(b.spent / b.allocated) * 100} className="h-3 bg-gray-800" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BudgetManagement;
