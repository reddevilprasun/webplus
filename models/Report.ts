import mongoose from 'mongoose';
import { string } from 'zod';

const reportSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  report: {
    total_requests: Number,
    unique_ips: Number,
    status_code_distribution: Map,
    request_method_distribution: Map,
    hourly_request_distribution: Map,
    hourly_method_distribution: Map,
    top_requested_urls:Map,
    requests_per_ip:mongoose.Schema.Types.Mixed,
    anomalies: Number,
    anomaly_details: [mongoose.Schema.Types.Mixed],
  },
  userId:{
    type:String,
    require: true
  },
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
