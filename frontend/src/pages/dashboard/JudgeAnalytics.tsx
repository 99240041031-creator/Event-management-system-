import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { judgeScoringService } from '../../services/judgeScoringService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { AlertCircle, TrendingUp, Users, Award } from 'lucide-react';
import { Cell } from 'recharts';

interface AnalyticsData {
    scoreDistribution: number[];
    criteriaAverages: Record<string, number>;
    judgeDeviation: Record<string, number>;
}

const JudgeAnalytics: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                if (!id) return;
                const result = await judgeScoringService.getAnalytics(id);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id]);

    if (loading) {
        return (
            <div className="p-8 space-y-6 bg-[#0f1115] min-h-screen text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full bg-gray-800" />)}
                </div>
                <Skeleton className="h-[400px] w-full bg-gray-800" />
            </div>
        );
    }

    if (!data) return <div className="p-8 text-white">No analytics data available.</div>;

    const distributionData = data.scoreDistribution.map((count, i) => ({
        range: `${i * 10}-${(i + 1) * 10}`,
        count
    }));

    const criteriaData = Object.entries(data.criteriaAverages).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
    }));

    const deviationData = Object.entries(data.judgeDeviation).map(([name, value]) => ({
        name,
        deviation: parseFloat(value.toFixed(2))
    }));

    return (
        <div className="p-8 space-y-8 bg-[#0a0c10] min-h-screen text-gray-100">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Judge Analytics & Insight
                    </h1>
                    <p className="text-gray-400 mt-1">Deep dive into scoring patterns and bias detection</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => id && judgeScoringService.downloadReport(id)}
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-2"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Export Leaderboard PDF
                    </Button>
                    <Award className="w-12 h-12 text-blue-500/50" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Evaluations</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.scoreDistribution.reduce((a, b) => a + b, 0)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Scoring Consistency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">High</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 hover:border-red-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Bias Detection</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">Normal</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Distribution */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="range" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Criteria Breakdown */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Criteria Performance Average</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={criteriaData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="name" stroke="#999" />
                                <PolarRadiusAxis stroke="#999" />
                                <Radar
                                    name="Avg Score"
                                    dataKey="value"
                                    stroke="#a855f7"
                                    fill="#a855f7"
                                    fillOpacity={0.6}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Judge Deviation */}
                <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Judge Deviation from Mean</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deviationData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" stroke="#999" />
                                <YAxis dataKey="name" type="category" stroke="#999" width={150} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                    formatter={(value: number) => [value > 0 ? `+${value}` : value, 'Deviation']}
                                />
                                <Bar dataKey="deviation" radius={[0, 4, 4, 0]}>
                                    {deviationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.deviation > 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default JudgeAnalytics;
