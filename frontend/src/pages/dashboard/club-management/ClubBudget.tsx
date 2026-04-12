import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { facultyClubApi } from '@/lib/api';

const ClubBudget = ({ clubId }: { clubId: string }) => {
    const [budget, setBudget] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        facultyClubApi.getBudget(clubId)
            .then(res => setBudget(res))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [clubId]);

    if (loading) return <Card><CardContent className="p-8 text-center">Loading budget...</CardContent></Card>;
    if (!budget) return <Card><CardContent className="p-8 text-center">No budget data available.</CardContent></Card>;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Fiscal Year: {budget.fiscalYear}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Allocated</span>
                            <span className="font-bold">${budget.allocated}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Spent</span>
                            <span className="font-bold text-red-500">${budget.spent}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">
                            {budget.allocated > 0 ? ((budget.spent / budget.allocated) * 100).toFixed(1) : 0}% Utilized
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500 text-sm">No recent transactions recorded.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClubBudget;
