"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import ReportPage from './result'; // Adjust the import path as needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UploadIcon } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type ReportData = {
  total_requests: number;
  unique_ips: number;
  status_code_distribution: Record<string, number>;
  request_method_distribution: Record<string, number>;
  hourly_request_distribution: Record<string, number>;
  hourly_method_distribution:Array<Record<string,number>>;
  anomalies: number;
  anomaly_details: Array<any>;
};

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string>("");

  const analyzeLogFile = useMutation(api.logAnalyze.logAnalyze)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const target = e.target as HTMLInputElement;
    // const file = target?.files?.[0];
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result as string;
      setFileContent(fileContent);
      
      try {
        // Call the mutation to process the log file
        const reportData = await analyzeLogFile({ log: fileContent });
        setReportId(reportData);  // Set report to display it
      } catch (error) {
        toast.error('Error analyzing the log file');
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
    
  };
  // for testing purpose only 
  // const onClick = async() => {
  //   const reportResponse = await axios.get(`/api/get-report?reportId=66b072468d3aa3261001bd48`);
  //   setReportData(reportResponse.data.report);
  // }

  return (
    <div className=' flex flex-col gap-8 m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Upload Log Files</CardTitle>
          <CardDescription>Drag and drop your log files here or click to select files</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-4 py-20">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Drag and drop your log files here or click to select files.</p>
              <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept='.log' />
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
                Select File
              </label>
              {file && (
                <p className="text-green-500">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading} color="primary" variant="shadow" >
                {loading ? 'Uploading...' : 'Upload and Analyze'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* {reportData && (
        <ReportPage reportData={reportData} />
      )} */}
    </div>
  );
};

export default Upload;
