import sys
import json
import re
import pandas as pd
from datetime import datetime
from sklearn.ensemble import IsolationForest

def process_log_file(file_path):
    log_data = []
    with open(file_path, 'r') as file:
        while True:
            lines = file.readlines(1000)  # Read in chunks
            if not lines:
                break
            log_data.extend([extract_log_data(line) for line in lines if extract_log_data(line) is not None])
    
    df = pd.DataFrame(log_data)
    # Further processing...

# Function to extract log data
def extract_log_data(log_line):
    log_pattern = re.compile(r'(?P<ip>\d+\.\d+\.\d+\.\d+) - - \[(?P<datetime>.*?)\] "(?P<method>\S+) (?P<url>.*?) HTTP/\d\.\d" (?P<status>\d+) (?P<size>\d+) "(?P<referrer>.*?)" "(?P<user_agent>.*?)"')
    match = log_pattern.match(log_line)
    if match:
        return match.groupdict()
    return None

# Get the log file path from command line arguments
log_file_path = sys.argv[1]

# Read log file
with open(log_file_path, 'r') as file:
    log_lines = file.readlines()

# Extract data
log_data = [extract_log_data(line) for line in log_lines]
log_data = [data for data in log_data if data is not None]

# Convert to DataFrame
df = pd.DataFrame(log_data)

# Convert datetime to a proper format
df['datetime'] = pd.to_datetime(df['datetime'], format='%d/%b/%Y:%H:%M:%S %z')

# Convert relevant columns to appropriate data types
df['status'] = df['status'].astype(int)
df['size'] = df['size'].astype(int)
df['hour'] = df['datetime'].dt.hour

# Anomaly Detection
features = df[['status', 'size', 'hour']]
model = IsolationForest(contamination=0.01, random_state=42)
df['anomaly'] = model.fit_predict(features)
anomalies = df[df['anomaly'] == -1]

# Hourly request method distribution
hourly_method_distribution = df.groupby(['hour', 'method']).size().unstack(fill_value=0).to_dict(orient='index')

# Generate report
report = {
    'total_requests': len(df),
    'unique_ips': df['ip'].nunique(),
    'status_code_distribution': df['status'].value_counts().to_dict(),
    'request_method_distribution': df['method'].value_counts().to_dict(),
    'hourly_request_distribution': df['hour'].value_counts().sort_index().to_dict(),
    'hourly_method_distribution': hourly_method_distribution,
    'top_requested_urls': df['url'].value_counts().head(10).to_dict(),
    'requests_per_ip': df['ip'].value_counts().to_dict(),
    'anomalies': len(anomalies),
    'anomaly_details': anomalies.to_dict(orient='records')
}

# Convert timestamps in the anomaly details to string format
for anomaly in report['anomaly_details']:
    if 'datetime' in anomaly:
        anomaly['datetime'] = anomaly['datetime'].isoformat()

print(json.dumps(report))
