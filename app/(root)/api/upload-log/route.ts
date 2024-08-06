import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';



export async function POST(req: NextRequest) {
  // Define the upload directory
  const uploadDir = path.join(process.cwd(), 'uploads');

  // Ensure the upload directory exists
  await mkdir(uploadDir, { recursive: true }).catch(console.error);
  // Parse the form data from the request
  const data = await req.formData();
  const file = data.get('logfile') as File | null;

  if (!file) {
    return NextResponse.json({ message: 'File not found', success: false });
  }

  // Convert the file to a buffer
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);

  // Define the path for the uploaded file
  const filePath = path.join(uploadDir, file.name);

  // Write the file to the specified path
  await writeFile(filePath, fileBuffer);

  return NextResponse.json({path: filePath, message: "File Uploaded!",success: true})
}
