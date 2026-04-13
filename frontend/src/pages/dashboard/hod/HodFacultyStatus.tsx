import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hodService } from '@/services/hodService';

export default function HodFacultyStatus() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hodService.getFacultyStatus().then(data => {
      setFaculty(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setFaculty([]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading faculty data...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Faculty Status Module</h1>
      <Card>
        <CardHeader><CardTitle>Department Faculty Overview</CardTitle></CardHeader>
        <CardContent>
          {faculty.length === 0 && <p className="text-sm text-slate-500">No faculty data found.</p>}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {faculty.map(f => (
              <Card key={f.id} className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{f.firstName} {f.lastName}</h3>
                  <p className="text-sm text-slate-500">{f.email}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Score: {f.points || 0}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Streak: {f.streak || 0}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
