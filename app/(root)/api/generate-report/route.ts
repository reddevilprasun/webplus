import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import Report from '@/models/Report';
import { auth } from '@/auth';

const executePythonScript = (filePath: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    console.log(`Executing Python script with filePath: ${filePath}`);
    const pythonProcess = spawn('python', [path.join(process.cwd(), 'scripts', 'process-log.py'), filePath]);

    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
      console.error(chunk.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(data));
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
};

export async function POST(req: NextRequest) {

  const { filePath } = await req.json();
  // Get the session
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: 'You are not logged in! Please log in for further processing.' });
  }

  const user = session.user;

  try {
    const reportData = await executePythonScript(filePath);
    // Convert requests_per_ip to a Map
    if (reportData.requests_per_ip) {
      reportData.requests_per_ip = new Map(Object.entries(reportData.requests_per_ip));
    }

    const newReport = await Report.create({
      report: {
        ...reportData,
        requests_per_ip: Object.fromEntries(reportData.requests_per_ip),
      },
      userId: user?.id,
    })
    return NextResponse.json({
      reportId: newReport._id.toString(),
      message: "Report successfully store in database!",
      success: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', success: false });
  }
}