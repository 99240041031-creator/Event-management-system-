import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hodService } from '@/services/hodService';

export default function HodSyllabusTracking() {
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hodService.getSyllabusProgress().then(data => {
      setSyllabus(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setSyllabus([]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading Syllabus Data...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daily Syllabus Tracking</h1>
      <Card>
        <CardHeader><CardTitle>Faculty Progress Monitor</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syllabus.length === 0 && <p className="text-sm text-slate-500">No syllabus milestones reported yet.</p>}
            {syllabus.map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{s.subject?.name} <span className="text-sm font-normal text-slate-500">by {s.faculty?.email}</span></h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'DELAYED' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.status}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${s.completionPercentage || 0}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{s.completionPercentage || 0}% Completed</span>
                  <span>Last Topic: {s.lastTopicCovered || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
