import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Server, 
  Network,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { cachedAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change, trend }) => (
  <motion.div variants={cardVariants}>
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex align-items-center">
        <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
          <Icon className={`text-${color}`} size={24} />
        </div>
        <div className="flex-grow-1">
          <h6 className="text-muted mb-1 small">{title}</h6>
          <h4 className="mb-0">{value}</h4>
          {change && (
            <small className={`text-${trend === 'up' ? 'success' : 'danger'}`}>
              {trend === 'up' ? '↗' : '↘'} {change}%
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  </motion.div>
);

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <motion.div variants={cardVariants}>
    <Card 
      className="h-100 shadow-sm border-0 cursor-pointer hover-lift"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body className="text-center">
        <div className={`rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-${color} bg-opacity-10`} 
             style={{ width: '60px', height: '60px' }}>
          <Icon className={`text-${color}`} size={28} />
        </div>
        <h6 className="mb-2">{title}</h6>
        <p className="text-muted small mb-0">{description}</p>
      </Card.Body>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const { 
    data: metricsData, 
    isLoading: metricsLoading, 
    error: metricsError,
    refetch: refetchMetrics 
  } = useQuery(
    'dashboard-metrics',
    () => cachedAPI.getMetrics({ limit: 20 }),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  );

  const { 
    data: rulesData, 
    isLoading: rulesLoading 
  } = useQuery(
    'dashboard-rules',
    () => cachedAPI.getRules({ limit: 5 }),
    { staleTime: 60000 } // 1 minute
  );

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    if (!metricsData?.data) return null;

    const metrics = metricsData.data;
    const latest = metrics[0];
    const previous = metrics[1];

    if (!latest) return null;

    const calculateChange = (current, prev) => {
      if (!prev) return 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    return {
      systemHealth: latest.cpu_usage < 80 && latest.memory_usage < 80 ? 'Good' : 'Warning',
      cpuUsage: `${latest.cpu_usage.toFixed(1)}%`,
      memoryUsage: `${latest.memory_usage.toFixed(1)}%`,
      diskUsage: `${latest.disk_usage.toFixed(1)}%`,
      totalMetrics: metrics.length,
      cpuChange: previous ? calculateChange(latest.cpu_usage, previous.cpu_usage) : 0,
      memoryChange: previous ? calculateChange(latest.memory_usage, previous.memory_usage) : 0,
      diskChange: previous ? calculateChange(latest.disk_usage, previous.disk_usage) : 0,
      lastUpdate: latest.timestamp,
    };
  }, [metricsData]);

  // Chart data
  const chartData = useMemo(() => {
    if (!metricsData?.data) return null;

    const metrics = metricsData.data.slice(0, 10).reverse();
    
    return {
      labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: 'CPU Usage (%)',
          data: metrics.map(m => m.cpu_usage),
          borderColor: 'rgb(13, 110, 253)',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Memory Usage (%)',
          data: metrics.map(m => m.memory_usage),
          borderColor: 'rgb(25, 135, 84)',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Disk Usage (%)',
          data: metrics.map(m => m.disk_usage),
          borderColor: 'rgb(220, 53, 69)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [metricsData]);

  const systemHealthData = useMemo(() => {
    if (!dashboardStats) return null;

    return {
      labels: ['Good', 'Warning', 'Critical'],
      datasets: [
        {
          data: [70, 25, 5], // Example distribution
          backgroundColor: [
            'rgba(25, 135, 84, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(220, 53, 69, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [dashboardStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchMetrics();
    setRefreshing(false);
  };

  if (metricsLoading && !metricsData) {
    return <LoadingSpinner />;
  }

  if (metricsError) {
    return <ErrorAlert error={metricsError} onRetry={refetchMetrics} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Security Dashboard</h2>
                <p className="text-muted mb-0">
                  Monitor your systems in real-time
                  {dashboardStats?.lastUpdate && (
                    <span className="text-muted">
                      • Last updated {formatDistanceToNow(new Date(dashboardStats.lastUpdate), { addSuffix: true })}
                    </span>
                  )}
                </p>
              </div>
              <Button 
                variant="outline-primary" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </Col>
        </Row>

        {/* System Status Alert */}
        {dashboardStats && dashboardStats.systemHealth === 'Warning' && (
          <motion.div variants={cardVariants}>
            <Row className="mb-4">
              <Col>
                <Alert variant="warning" className="d-flex align-items-center">
                  <AlertTriangle className="me-2" size={20} />
                  <div>
                    <strong>System Health Warning</strong>
                    <p className="mb-0">Some metrics are above normal thresholds. Check your system resources.</p>
                  </div>
                </Alert>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Key Metrics Cards */}
        <Row className="mb-4 g-3">
          <Col lg={3} md={6}>
            <StatCard
              title="System Health"
              value={dashboardStats?.systemHealth || 'Unknown'}
              icon={dashboardStats?.systemHealth === 'Good' ? CheckCircle : AlertTriangle}
              color={dashboardStats?.systemHealth === 'Good' ? 'success' : 'warning'}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              title="CPU Usage"
              value={dashboardStats?.cpuUsage || '0%'}
              icon={Activity}
              color="primary"
              change={Math.abs(dashboardStats?.cpuChange || 0)}
              trend={dashboardStats?.cpuChange > 0 ? 'up' : 'down'}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              title="Memory Usage"
              value={dashboardStats?.memoryUsage || '0%'}
              icon={Server}
              color="info"
              change={Math.abs(dashboardStats?.memoryChange || 0)}
              trend={dashboardStats?.memoryChange > 0 ? 'up' : 'down'}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              title="Disk Usage"
              value={dashboardStats?.diskUsage || '0%'}
              icon={TrendingUp}
              color="warning"
              change={Math.abs(dashboardStats?.diskChange || 0)}
              trend={dashboardStats?.diskChange > 0 ? 'up' : 'down'}
            />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4 g-3">
          <Col lg={8}>
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pb-0">
                  <h5 className="mb-0">System Metrics Trend</h5>
                  <small className="text-muted">Real-time system performance</small>
                </Card.Header>
                <Card.Body>
                  {chartData ? (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          },
                        },
                        interaction: {
                          mode: 'nearest',
                          axis: 'x',
                          intersect: false,
                        },
                      }}
                      height={300}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                      <p className="text-muted">No data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={4}>
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 pb-0">
                  <h5 className="mb-0">System Health</h5>
                  <small className="text-muted">Overall system status</small>
                </Card.Header>
                <Card.Body>  
                  {systemHealthData ? (
                    <Doughnut
                      data={systemHealthData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                      height={250}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                      <p className="text-muted">No data available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 pb-0">
                  <h5 className="mb-0">Quick Actions</h5>
                  <small className="text-muted">Common tasks and shortcuts</small>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3} md={6}>
                      <QuickActionCard
                        title="Collect Metrics"
                        description="Gather latest system metrics"
                        icon={Activity}
                        color="primary"
                        onClick={() => window.location.href = '/monitoring'}
                      />
                    </Col>
                    <Col lg={3} md={6}>
                      <QuickActionCard
                        title="Security Rules"
                        description="Manage automation rules"
                        icon={Shield}
                        color="success"
                        onClick={() => window.location.href = '/automation'}
                      />
                    </Col>
                    <Col lg={3} md={6}>
                      <QuickActionCard
                        title="Network Ping"
                        description="Test network connectivity"
                        icon={Network}
                        color="info"
                        onClick={() => window.location.href = '/monitoring'}
                      />
                    </Col>
                    <Col lg={3} md={6}>
                      <QuickActionCard
                        title="View Logs"
                        description="Check automation logs"
                        icon={Clock}
                        color="warning"
                        onClick={() => window.location.href = '/automation'}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Active Rules Summary */}
        {rulesData?.data && (
          <Row>
            <Col>
              <motion.div variants={cardVariants}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white border-0 pb-0">
                    <h5 className="mb-0">Active Security Rules</h5>
                    <small className="text-muted">Recently configured automation rules</small>
                  </Card.Header>
                  <Card.Body>
                    {rulesData.data.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Condition</th>
                              <th>Threshold</th>
                              <th>Action</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rulesData.data.slice(0, 5).map((rule, index) => (
                              <tr key={rule.id || index}>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    {rule.condition?.replace('_', ' ')}
                                  </span>
                                </td>
                                <td>{rule.threshold}%</td>
                                <td>{rule.action?.replace('_', ' ')}</td>
                                <td>
                                  <span className={`badge ${rule.active ? 'bg-success' : 'bg-secondary'}`}>
                                    {rule.active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Shield className="text-muted mb-3" size={48} />
                        <h6 className="text-muted">No active rules</h6>
                        <p className="text-muted">Create your first automation rule to get started</p>
                        <Button variant="primary" onClick={() => window.location.href = '/automation'}>
                          Create Rule
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}
      </Container>
    </motion.div>
  );
};

export default Dashboard;