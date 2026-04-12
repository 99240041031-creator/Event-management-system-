import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyReportsPage = () => {
    const navigate = useNavigate();

    const reportTypes = [
        {
            title: 'Event Participation Report',
            description: 'Detailed breakdown of student participation across all your events.',
            icon: UsersReportIcon,
            action: () => console.log('Download Participation Report')
        },
        {
            title: 'Attendance Records',
            description: 'Download attendance sheets for all completed events.',
            icon: AttendanceIcon,
            action: () => console.log('Download Attendance')
        },
        {
            title: 'Budget & Expenses',
            description: 'Financial summary of club activities and event costs.',
            icon: FinanceIcon,
            action: () => console.log('Download Financial Report')
        },
        {
            title: 'Certificate Issuance Log',
            description: 'History of all certificates issued to students.',
            icon: CertificateIcon,
            action: () => navigate('/dashboard/faculty/certificates') // Link to certs page
        }
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Reports Center</h1>
                <p className="text-muted-foreground mt-2">Generate and download reports for your events and clubs.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
                {reportTypes.map((report, index) => (
                    <motion.div
                        key={report.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <report.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{report.title}</CardTitle>
                                    <CardDescription className="mt-1">{report.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="outline" onClick={report.action}>
                                    <Download className="mr-2 h-4 w-4" /> Download Report
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="mt-8 bg-slate-50 dark:bg-slate-900 border-dashed">
                <CardContent className="py-10 text-center">
                    <BarChart className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Need Custom Analytics?</h3>
                    <p className="text-slate-500 mb-4">Check the Analytics Dashboard for interactive charts and trends.</p>
                    <Button onClick={() => navigate('/dashboard/faculty/analytics')}>
                        Go to Analytics Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

// Icons
function UsersReportIcon({ className }: { className?: string }) {
    return <FileText className={className} />;
}

function AttendanceIcon({ className }: { className?: string }) {
    return <FileText className={className} />;
}

function FinanceIcon({ className }: { className?: string }) {
    return <PieChart className={className} />;
}

function CertificateIcon({ className }: { className?: string }) {
    return <FileText className={className} />;
}

export default FacultyReportsPage;
