import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Server, 
  HardDrive, 
  Network, 
  RefreshCw, 
  Play,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { monitoringAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { FixedSizeList as List } from 'react-window';

const Monitoring = () => {
  const [showPingModal, setShowPingModal] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm();

  // Fetch metrics with pagination for performance
  const { 
    data: metricsData, 
    isLoading: metricsLoading, 
    refetch: refetchMetrics 
  } = useQuery(
    'monitoring-metrics',
    () => monitoringAPI.getMetrics({ limit: 100 }),
    {
      refetchInterval: 15000, // 15 seconds
      staleTime: 5000,
    }
  );

  // Fetch ping results
  const { 
    data: pingData, 
    isLoading: pingLoading,
    refetch: refetchPings
  } = useQuery(
    'ping-results',
    () => monitoringAPI.getPingResults({ limit: 50 }),
    {
      refetchInterval: 30000, // 30 seconds
      staleTime: 10000,
    }
  );

  // Collect metrics mutation
  const collectMetricsMutation = useMutation(
    monitoringAPI.collectMetrics,
    {
      onSuccess: () => {
        toast.success('Metrics collected successfully!');
        queryClient.invalidateQueries('monitoring-metrics');
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Failed to collect metrics');
      },
    }
  );

  // Ping IP mutation
  const pingMutation = useMutation(
    monitoringAPI.pingIP,
    {
      onSuccess: () => {
        toast.success('Ping completed successfully!');
        queryClient.invalidateQueries('ping-results');
        setShowPingModal(false);
        reset();
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Ping failed');
      },
    }
  );

  // Chart data for metrics
  const chartData = useMemo(() => {
    if (!metricsData?.data) return null;

    const metrics = metricsData.data.slice(0, 20).reverse();
    
    return {
      labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: 'CPU Usage (%)',
          data: metrics.map(m => m.cpu_usage),
          borderColor: 'rgb(13, 110, 253)',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Memory Usage (%)',
          data: metrics.map(m => m.memory_usage),
          borderColor: 'rgb(25, 135, 84)',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Disk Usage (%)',
          data: metrics.map(m => m.disk_usage),
          borderColor: 'rgb(220, 53, 69)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [metricsData]);

  // Latest metrics for display
  const latestMetrics = useMemo(() => {
    return metricsData?.data?.[0] || null;
  }, [metricsData]);

  const onPingSubmit = (data) => {
    pingMutation.mutate(data.ip);
  };

  // Virtual list item renderer for metrics table
  const MetricRow = ({ index, style }) => {
    const metric = metricsData?.data[index];
    if (!metric) return null;

    return (
      <div style={style} className="d-flex align-items-center border-bottom p-2">
        <div className="flex-grow-1 row">
          <div className="col-3">
            <small className="text-muted">
              {formatDistanceToNow(new Date(metric.timestamp), { addSuffix: true })}
            </small>
          </div>
          <div className="col-3">
            <Badge bg={metric.cpu_usage > 80 ? 'danger' : metric.cpu_usage > 60 ? 'warning' : 'success'}>
              CPU: {metric.cpu_usage.toFixed(1)}%
            </Badge>
          </div>
          <div className="col-3">
            <Badge bg={metric.memory_usage > 80 ? 'danger' : metric.memory_usage > 60 ? 'warning' : 'success'}>
              Memory: {metric.memory_usage.toFixed(1)}%
            </Badge>
          </div>
          <div className="col-3">
            <Badge bg={metric.disk_usage > 80 ? 'danger' : metric.disk_usage > 60 ? 'warning' : 'success'}>
              Disk: {metric.disk_usage.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  if (metricsLoading && !metricsData) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">System Monitoring</h2>
              <p className="text-muted mb-0">Monitor system performance and network connectivity</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary"
                onClick={() => setShowPingModal(true)}
              >
                <Network className="me-1" size={16} />
                Ping Test
              </Button>
              <Button 
                variant="primary"
                onClick={() => collectMetricsMutation.mutate()}
                disabled={collectMetricsMutation.isLoading}
              >
                {collectMetricsMutation.isLoading ? (
                  <>
                    <RefreshCw className="me-1 spin" size={16} />
                    Collecting...
                  </>
                ) : (
                  <>
                    <Play className="me-1" size={16} />
                    Collect Metrics
                  </>
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Current Status Cards */}
      {latestMetrics && (
        <Row className="mb-4 g-3">
          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className={`rounded-circle p-3 me-3 ${
                    latestMetrics.cpu_usage > 80 ? 'bg-danger' : 
                    latestMetrics.cpu_usage > 60 ? 'bg-warning' : 'bg-success'
                  } bg-opacity-10`}>
                    <Activity className={`${
                      latestMetrics.cpu_usage > 80 ? 'text-danger' : 
                      latestMetrics.cpu_usage > 60 ? 'text-warning' : 'text-success'
                    }`} size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">CPU Usage</h6>
                    <h4 className="mb-0">{latestMetrics.cpu_usage.toFixed(1)}%</h4>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(latestMetrics.timestamp), { addSuffix: true })}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className={`rounded-circle p-3 me-3 ${
                    latestMetrics.memory_usage > 80 ? 'bg-danger' : 
                    latestMetrics.memory_usage > 60 ? 'bg-warning' : 'bg-success'
                  } bg-opacity-10`}>
                    <Server className={`${
                      latestMetrics.memory_usage > 80 ? 'text-danger' : 
                      latestMetrics.memory_usage > 60 ? 'text-warning' : 'text-success'
                    }`} size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Memory Usage</h6>
                    <h4 className="mb-0">{latestMetrics.memory_usage.toFixed(1)}%</h4>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(latestMetrics.timestamp), { addSuffix: true })}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className={`rounded-circle p-3 me-3 ${
                    latestMetrics.disk_usage > 80 ? 'bg-danger' : 
                    latestMetrics.disk_usage > 60 ? 'bg-warning' : 'bg-success'
                  } bg-opacity-10`}>
                    <HardDrive className={`${
                      latestMetrics.disk_usage > 80 ? 'text-danger' : 
                      latestMetrics.disk_usage > 60 ? 'text-warning' : 'text-success'
                    }`} size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Disk Usage</h6>
                    <h4 className="mb-0">{latestMetrics.disk_usage.toFixed(1)}%</h4>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(latestMetrics.timestamp), { addSuffix: true })}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      )}

      {/* Charts and Tables */}
      <Row className="g-4">
        {/* Metrics Chart */}
        <Col lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">System Metrics Timeline</h5>
                    <small className="text-muted">Real-time performance monitoring</small>
                  </div>
                  <Button variant="outline-secondary" size="sm" onClick={refetchMetrics}>
                    <RefreshCw size={14} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {chartData ? (
                  <Line
                    data={chartData}
                                        options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            stepSize: 20,
                          },
                          title: {
                            display: true,
                            text: 'Usage (%)',
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Time',
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        },
                      },
                      interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false,
                      },
                    }}
                  />
                ) : (
                  <p className="text-center text-muted">No metrics data available.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* Metrics Table (Virtualized) */}
        <Col lg={4} style={{ height: 500 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Recent Metrics</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {metricsData?.data?.length ? (
                  <List
                    height={460}
                    itemCount={metricsData.data.length}
                    itemSize={50}
                    width="100%"
                  >
                    {MetricRow}
                  </List>
                ) : (
                  <p className="text-center my-4 text-muted">No metrics data available.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Ping Results Table */}
      <Row className="mt-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ping Test Results</h5>
                <Button variant="outline-secondary" size="sm" onClick={refetchPings} disabled={pingLoading}>
                  <RefreshCw size={14} />
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {pingLoading && !pingData ? (
                  <LoadingSpinner />
                ) : pingData?.data?.length ? (
                  <Table hover striped bordered responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>IP Address</th>
                        <th>Status</th>
                        <th>Response Time (ms)</th>
                        <th>Last Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pingData.data.map((ping) => (
                        <tr key={ping.id}>
                          <td>{ping.ip}</td>
                          <td>
                            {ping.status === 'success' ? (
                              <Badge bg="success">
                                <CheckCircle size={14} className="me-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge bg="danger">
                                <AlertCircle size={14} className="me-1" />
                                Fail
                              </Badge>
                            )}
                          </td>
                          <td>{ping.response_time_ms ?? '-'}</td>
                          <td>
                            <small className="text-muted">
                              {formatDistanceToNow(new Date(ping.checked_at), { addSuffix: true })}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center my-4 text-muted">No ping test results available.</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Ping Modal */}
      <Modal show={showPingModal} onHide={() => setShowPingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ping an IP Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onPingSubmit)}>
            <Form.Group controlId="formIP">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter IP address"
                {...register('ip', { required: 'IP address is required' })}
                isInvalid={!!errors?.ip}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.ip?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowPingModal(false)} disabled={pingMutation.isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={pingMutation.isLoading}>
                {pingMutation.isLoading ? (
                  <>
                    <RefreshCw className="me-1 spin" size={16} />
                    Pinging...
                  </>
                ) : (
                  'Ping'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Monitoring;
