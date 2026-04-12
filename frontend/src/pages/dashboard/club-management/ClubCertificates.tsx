import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { facultyClubApi } from '@/lib/api';
import { toast } from 'sonner';
import { Award, Download } from 'lucide-react';

const ClubCertificates = ({ clubId }: { clubId: string }) => {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            await facultyClubApi.generateCertificates(clubId);
            toast.success('Certificate generation started for recent events');
        } catch (error) {
            console.error(error);
            toast.error('Failed to start certificate generation');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
                <CardDescription>Generate and manage certificates for club events and hackathons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Bulk Generation</h4>
                        <p className="text-sm text-slate-500">Generate certificates for all participants of completed events</p>
                    </div>
                    <Button onClick={handleGenerate} disabled={generating}>
                        {generating ? 'Processing...' : 'Generate All'}
                    </Button>
                </div>

                <div>
                    <h4 className="font-medium mb-4">Recent Certificates</h4>
                    <p className="text-sm text-slate-500">No certificates generated recently.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ClubCertificates;
