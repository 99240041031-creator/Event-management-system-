import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hodService } from '@/services/hodService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HodStudentStatus() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hodService.getStudentStatus().catch(() => []),
      hodService.getStudentExams().catch(() => [])
    ]).then(([sData, eData]) => {
      setStudents(Array.isArray(sData) ? sData : []);
      setExams(Array.isArray(eData) ? eData : []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setStudents([]);
      setExams([]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading student tracking & exams...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Exam Status Tracker</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pass/Fail Analytics (% by Subject)</CardTitle></CardHeader>
          <CardContent className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={exams.map((e, i) => ({ name: `Score ${i+1}`, value: e.totalScore || 0 }))}>
                  <XAxis dataKey="name" hide={true}/>
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>At Risk Students Alert (Low Marks / Arrear)</CardTitle></CardHeader>
          <CardContent>
             {exams.filter(e => e.passStatus === 'FAIL' || e.passStatus === 'ARREAR' || (e.totalScore || 0) < 40).map(e => (
               <div key={e.id} className="flex justify-between items-center bg-red-50 p-3 rounded-lg mb-2 border border-red-100">
                  <div>
                    <p className="font-semibold text-red-700">{e.student?.email || 'Unknown Student'}</p>
                    <p className="text-xs text-red-600">Total Marks: {e.totalScore || 0} | {e.subject?.name || 'Unknown Subject'}</p>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-sm">Critical Risk</span>
               </div>
             ))}
             {exams.filter(e => e.passStatus === 'FAIL' || (e.totalScore || 0) < 40).length === 0 && (
               <p className="text-sm text-slate-500">No students are currently at academic risk.</p>
             )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader><CardTitle>Internal/External Marks (Live List)</CardTitle></CardHeader>
          <CardContent>
             {exams.length === 0 && <p className="text-sm text-slate-500">No exam results reported yet.</p>}
             <div className="grid gap-4 md:grid-cols-2">
                {exams.map(e => (
                  <div key={e.id} className="p-4 border rounded-xl flex flex-col">
                    <span className="font-bold">{e.subject?.name || 'Class Subject'} - {e.semester || 'N/A'}</span>
                    <span className="text-sm text-slate-500">Internal: {e.internalMarks || 0} | External: {e.externalMarks || 0}</span>
                    <span className="text-sm text-slate-500 mb-2">Total Score: {e.totalScore || 0}</span>
                    <span className={`text-xs px-2 py-1 w-fit rounded-full ${e.passStatus === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.passStatus}</span>
                  </div>
                ))}
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
