
import { Area, Bar, Line } from "@ant-design/plots"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AnomalyPage from './ananomy';


type AnomalyDetail = {
  ip: string;
  datetime: string;
  method: string;
  url: string;
  status: number;
  size: number;
  referrer: string;
  user_agent: string;
  hour: number;
  anomaly: number;
};

type ReportData = {
  total_requests: number;
  unique_ips: number;
  status_code_distribution: Record<string, number>;
  request_method_distribution: Record<string, number>;
  hourly_request_distribution: Record<string, number>;
  hourly_method_distribution: Array<Record<string, number>>;
  anomalies: number;
  anomaly_details: Array<AnomalyDetail>;
};

type Props = {
  reportData: ReportData | null;
};

const ReportPage = ({ reportData }: Props) => {

  if (!reportData) return <p className="text-center text-red-500">No report found</p>;

  // Calculate errors, warnings, and informational logs
  const errors = Object.entries(reportData.status_code_distribution).reduce((acc, [code, count]) => {
    if (Number(code) >= 400 && Number(code) < 500) {
      return acc + count;
    }
    return acc;
  }, 0);

  const warnings = Object.entries(reportData.status_code_distribution).reduce((acc, [code, count]) => {
    if (Number(code) >= 500) {
      return acc + count;
    }
    return acc;
  }, 0);

  const info = Object.entries(reportData.status_code_distribution).reduce((acc, [code, count]) => {
    if (Number(code) >= 200 && Number(code) < 300) {
      return acc + count;
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col gap-8 m-4">
      <h1 className="text-3xl font-bold mb-4">Report</h1>
      <h2 className="text-2xl font-semibold mb-4">Log Analysis Report</h2>
      <p className="mb-2"><strong>Total Requests:</strong> {reportData.total_requests}</p>
      <p className="mb-4"><strong>Unique IPs:</strong> {reportData.unique_ips}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reportData.total_requests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{errors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{warnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{info}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log Data Visualization</CardTitle>
          <CardDescription>Analyze your log data with interactive charts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Bar
              data={Object.entries(reportData.status_code_distribution).map(([code, count]) => ({
                type: code,
                value: count,
              }))}
              xField="value"
              yField="type"
              seriesField="type"
              legend={{ position: 'top-right' }}
              xAxis={{ title: { text: 'Status Code Count' } }}
              yAxis={{ title: { text: 'Status Code' } }}
              className="mb-6"
            />
            <Bar
              data={Object.entries(reportData.request_method_distribution).map(([method, count]) => ({
                type: method,
                value: count,
              }))}
              xField="value"
              yField="type"
              seriesField="type"
              legend={{ position: 'top-right' }}
              xAxis={{ title: { text: 'Request Count' } }}
              yAxis={{ title: { text: 'HTTP Method' } }}
              className="mb-6"
            />
            <Line
              data={Object.entries(reportData.hourly_request_distribution).map(([hour, count]) => ({
                hour: `Hour ${hour}`,
                count,
              }))}
              xField="hour"
              yField="count"
              xAxis={{ title: { text: 'Hour of Day' } }}
              yAxis={{ title: { text: 'Request Count' } }}
              smooth
              className="mb-6"
            />

            <Area
              data={Object.entries(reportData.hourly_method_distribution).flatMap(([hour, methods]) =>
                Object.entries(methods).map(([method, count]) => ({
                  hour: `Hour ${hour}`,
                  method,
                  count,
                }))
              )}
              xField="hour"
              yField="count"
              seriesField="method"
              xAxis={{ title: { text: 'Hour of Day' } }}
              yAxis={{ title: { text: 'Request Count' } }}
              areaStyle={{ fillOpacity: 0.5 }}
              legend={{ position: 'top-right' }}
              className="mb-6"
            />
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mb-2">Status Code Distribution</h3>
      <Bar
        data={Object.entries(reportData.status_code_distribution).map(([code, count]) => ({
          type: code,
          value: count,
        }))}
        xField="value"
        yField="type"
        seriesField="type"
        legend={{ position: 'top-right' }}
        xAxis={{ title: { text: 'Status Code Count' } }}
        yAxis={{ title: { text: 'Status Code' } }}
        className="mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Request Method Distribution</h3>
      <Bar
        data={Object.entries(reportData.request_method_distribution).map(([method, count]) => ({
          type: method,
          value: count,
        }))}
        xField="value"
        yField="type"
        seriesField="type"
        legend={{ position: 'top-right' }}
        xAxis={{ title: { text: 'Request Count' } }}
        yAxis={{ title: { text: 'HTTP Method' } }}
        className="mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Hourly Request Distribution</h3>
      <Line
        data={Object.entries(reportData.hourly_request_distribution).map(([hour, count]) => ({
          hour: `Hour ${hour}`,
          count,
        }))}
        xField="hour"
        yField="count"
        xAxis={{ title: { text: 'Hour of Day' } }}
        yAxis={{ title: { text: 'Request Count' } }}
        smooth
        className="mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Hourly Method Distribution</h3>
      <Area
        data={Object.entries(reportData.hourly_method_distribution).flatMap(([hour, methods]) =>
          Object.entries(methods).map(([method, count]) => ({
            hour: `Hour ${hour}`,
            method,
            count,
          }))
        )}
        xField="hour"
        yField="count"
        seriesField="method"
        xAxis={{ title: { text: 'Hour of Day' } }}
        yAxis={{ title: { text: 'Request Count' } }}
        areaStyle={{ fillOpacity: 0.5 }}
        legend={{ position: 'top-right' }}
        className="mb-6"
      />
      <h3 className="text-xl font-semibold mb-2">Anomalies Detected</h3>
      <AnomalyPage reportData={reportData}/>
    </div>
  );
};


export default ReportPage;
