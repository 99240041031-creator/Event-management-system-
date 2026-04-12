import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LeaderboardEntry {
    teamName: string;
    projectTitle: string;
    score: number;
    rank?: number;
    previousRank?: number;
}

interface RealTimeLeaderboardProps {
    hackathonId: string;
    initialData?: LeaderboardEntry[];
}

const RealTimeLeaderboard = ({ hackathonId, initialData = [] }: RealTimeLeaderboardProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<LeaderboardEntry[]>(initialData);
    const [prevData, setPrevData] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/hackathon/${hackathonId}/leaderboard`, (message) => {
                    const newData: LeaderboardEntry[] = JSON.parse(message.body);
                    setData(prev => {
                        setPrevData(prev);
                        return newData;
                    });
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [hackathonId]);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const margin = { top: 20, right: 100, bottom: 40, left: 150 };
        const width = 800 - margin.left - margin.right;
        const height = Math.max(400, data.length * 50) - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.score) || 100])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.teamName))
            .range([0, height])
            .padding(0.3);

        const colorScale = d3.scaleSequential(d3.interpolateHcl("#4f46e5", "#06b6d4"))
            .domain([0, d3.max(data, d => d.score) || 100]);

        // Draw Bars
        const bars = g.selectAll(".bar")
            .data(data, (d: any) => d.teamName)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d: any) => y(d.teamName)!)
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("rx", 6)
            .attr("fill", (d: any) => colorScale(d.score))
            .transition()
            .duration(800)
            .attr("width", (d: any) => x(d.score));

        // Team Names (Y-axis Labels)
        g.selectAll(".label")
            .data(data, (d: any) => d.teamName)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("y", (d: any) => y(d.teamName)! + y.bandwidth() / 2)
            .attr("x", -10)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .attr("fill", "currentColor")
            .text((d: any) => d.teamName);

        // Scores
        g.selectAll(".score")
            .data(data, (d: any) => d.teamName)
            .enter()
            .append("text")
            .attr("class", "score")
            .attr("y", (d: any) => y(d.teamName)! + y.bandwidth() / 2)
            .attr("x", (d: any) => x(d.score) + 10)
            .attr("dy", ".35em")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "currentColor")
            .text((d: any) => d.score.toFixed(1));

    }, [data]);

    const getRankTrend = (entry: LeaderboardEntry, currentRank: number) => {
        const prevIndex = prevData.findIndex(p => p.teamName === entry.teamName);
        if (prevIndex === -1) return <Minus className="w-4 h-4 text-muted-foreground" />;

        if (prevIndex > currentRank) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (prevIndex < currentRank) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    };

    return (
        <Card className="w-full bg-card shadow-2xl border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Live Leaderboard
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time scoring updates and rank shifts</p>
                </div>
                <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-500 border-green-500/20">
                    Live Updates Active
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <svg ref={svgRef} width="800" height={Math.max(400, data.length * 50)} className="text-foreground mx-auto" />
                </div>

                <div className="mt-8 space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Rank Analysis</h3>
                    {data.slice(0, 5).map((entry, index) => (
                        <div key={entry.teamName} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-4">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-white' : 'bg-secondary text-foreground'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-semibold">{entry.teamName}</p>
                                    <p className="text-xs text-muted-foreground">{entry.projectTitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-lg font-bold">{entry.score.toFixed(1)}</p>
                                    <p className="text-[10px] uppercase font-medium text-muted-foreground">Points</p>
                                </div>
                                {getRankTrend(entry, index)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RealTimeLeaderboard;
