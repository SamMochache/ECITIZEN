import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { Chart, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { monitoringAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { FixedSizeList as List } from 'react-window';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale);

const Monitoring = () => {
  const [showPingModal, setShowPingModal] = useState(false);
  const queryClient = useQueryClient();

  const chartRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  const { 
    data: metricsData, 
    isLoading: metricsLoading, 
    refetch: refetchMetrics 
  } = useQuery(
    'monitoring-metrics',
    () => monitoringAPI.getMetrics({ limit: 100 }),
    {
      refetchInterval: 15000,
      staleTime: 5000,
    }
  );

  const { 
    data: pingData, 
    isLoading: pingLoading,
    refetch: refetchPings
  } = useQuery(
    'ping-results',
    () => monitoringAPI.getPingResults({ limit: 50 }),
    {
      refetchInterval: 30000,
      staleTime: 10000,
    }
  );

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

  const latestMetrics = useMemo(() => {
    return metricsData?.data?.[0] || null;
  }, [metricsData]);

  const onPingSubmit = (data) => {
    pingMutation.mutate(data.ip);
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

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
      {/* the rest of the code continues... */}
    </Container>
  );
};

export default Monitoring;
