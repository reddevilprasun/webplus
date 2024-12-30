"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import ReportPage from './result'; // Adjust the import path as needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UploadIcon } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('logfile', file);

    try {
      const response = await axios.post('/api/upload-log', formData);
      if(!response.data.success){
        toast.error(response.data.message);
        return;
      }
      if(response.data.success){
        toast.success(response.data.message);
      }
      const  path  = await response.data.path;
      const response2 = await axios.post('/api/generate-report', {filePath: path});
      if(!response2.data.success){
        toast.error(response2.data.message);
        return;
      }
      if(response2.data.success){
        toast.success(response2.data.message);
      }
      const reportId = await response2.data.reportId;
      setReportId(reportId);

      //Fetch the report data
      const reportResponse = await axios.get(`/api/get-report?reportId=${reportId}`);
      setReportData(reportResponse.data.report);
      console.log(reportResponse.data.report);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
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
              <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
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
