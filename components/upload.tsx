"use client";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UploadIcon, X } from 'lucide-react';
import { Button } from '@nextui-org/react';
import ReportPage from './result';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reportId, setReportId] = useState<Id<"report"> | null>(null);
  const [loading, setLoading] = useState(false);

  const mostCurrentReport = useQuery(api.logAnalyze.getUserCurrentReportId);

  useEffect(() => {
    if (mostCurrentReport) {
      setReportId(mostCurrentReport);
    }
  }, [mostCurrentReport]);

  const analyzeLogFile = useMutation(api.logAnalyze.logAnalyze);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result as string;

      try {
        // Call the mutation to process the log file
        const reportData = await analyzeLogFile({ log: fileContent });
        setReportId(reportData);  // Set report to display it
      } catch (error) {
        toast.error('Error analyzing the log file');
      } finally {
        setLoading(false);
        setFile(null);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className=' flex flex-col gap-8 m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Upload Log Files</CardTitle>
          <CardDescription>Drag and drop your log files here or click to select files</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-4 py-10 border-2 border-dashed border-gray-300 rounded-lg">
              {file ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button type="button" variant="ghost" isIconOnly onClick={handleRemoveFile} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <UploadIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Drag and drop your log files here or click to select files.
                  </p>
                </>
              )}
              <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept=".log" />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Select File
              </label>
            </div>
            <div className="flex justify-center mt-6">
              <Button type="submit" disabled={!file || loading} className="w-full">
                {loading ? "Uploading and Analyzing..." : "Upload and Analyze"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {!reportId && (
        <Card>
          <CardHeader>
            <CardTitle>Most Recent Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center">
              No report available
            </div>
          </CardContent>
        </Card>
      )}
      {reportId && <ReportPage reportId={reportId} />}
    </div>
  );
};

export default Upload;
