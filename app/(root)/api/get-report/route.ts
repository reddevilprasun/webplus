import dbConnect from '@/lib/mongoose';
import Report from '@/models/Report';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get the reportId from the query string
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get('reportId');

  if (!reportId) {
    return NextResponse.json({ message: 'Report ID is required', success: false }, { status: 400 });
  }

  try {
    await dbConnect();

    // Find the report by its ID
    const report = await Report.findById(reportId).exec();

    if (!report) {
      return NextResponse.json({ message: 'Report not found', success: false }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}
