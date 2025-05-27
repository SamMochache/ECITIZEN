import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Mail, 
  Shield, 
  FileText, 
  Cpu, 
  HardDrive, 
  Activity,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

const Automation = () => {
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [activeTab, setActiveTab] = useState('rules');
  const [loading, setLoading] = useState(false);

  const conditionOptions = [
    { value: 'CPU_HIGH', label: 'High CPU Usage', icon: Cpu },
    { value: 'MEMORY_HIGH', label: 'High Memory Usage', icon: Activity },
    { value: 'DISK_HIGH', label: 'High Disk Usage', icon: HardDrive },
    { value: 'IP_SUSPICIOUS', label: 'Suspicious IP Detected', icon: Shield }
  ];

  const actionOptions = [
    { value: 'EMAIL_ALERT', label: 'Send Email Alert', icon: Mail },
    { value: 'BLOCK_IP', label: 'Block IP', icon: Shield },
    { value: 'LOG_ONLY', label: 'Log Only', icon: FileText }
  ];

  const [formData, setFormData] = useState({
    condition: '',
    threshold: '',
    action: ''
  });

  // Mock API calls - replace with actual API endpoints
  const fetchRules = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/automation/rules/', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockRules = [
        {
          id: 1,
          condition: 'CPU_HIGH',
          threshold: 80.0,
          action: 'EMAIL_ALERT',
          active: true
        },
        {
          id: 2,
          condition: 'MEMORY_HIGH',
          threshold: 85.0,
          action: 'LOG_ONLY',
          active: false
        }
      ];
      setRules(mockRules);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/automation/logs/', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockLogs = [
        {
          id: 1,
          condition: 'CPU_HIGH',
          value: 85.2,
          action_taken: 'Email sent to user@example.com',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          condition: 'MEMORY_HIGH',
          value: 87.5,
          action_taken: 'Logged condition only',
          timestamp: '2024-01-15T09:15:00Z'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
    fetchLogs();
  }, []);

  const handleSubmit = async () => {
    if (!formData.condition || !formData.threshold || !formData.action) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const method = editingRule ? 'PUT' : 'POST';
      const url = editingRule 
        ? `/api/automation/rules/${editingRule.id}/`
        : '/api/automation/rules/';
      
      // Mock API call - replace with actual implementation
      console.log(`${method} ${url}`, formData);
      
      // Mock successful response
      const newRule = {
        id: editingRule ? editingRule.id : rules.length + 1,
        ...formData,
        threshold: parseFloat(formData.threshold),
        active: true
      };

      if (editingRule) {
        setRules(rules.map(rule => rule.id === editingRule.id ? newRule : rule));
      } else {
        setRules([...rules, newRule]);
      }

      setShowCreateForm(false);
      setEditingRule(null);
      setFormData({ condition: '', threshold: '', action: '' });
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    try {
      // Mock API call
      console.log(`PATCH /api/automation/rules/${ruleId}/`, { active: !rule.active });
      
      setRules(rules.map(r => 
        r.id === ruleId ? { ...r, active: !r.active } : r
      ));
    } catch (error) {
      console.error('Error toggling rule status:', error);
    }
  };

  const deleteRule = async (ruleId) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      // Mock API call
      console.log(`DELETE /api/automation/rules/${ruleId}/`);
      
      setRules(rules.filter(r => r.id !== ruleId));
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getConditionLabel = (condition) => {
    const option = conditionOptions.find(opt => opt.value === condition);
    return option ? option.label : condition;
  };

  const getActionLabel = (action) => {
    const option = actionOptions.find(opt => opt.value === action);
    return option ? option.label : action;
  };

  const getConditionIcon = (condition) => {
    const option = conditionOptions.find(opt => opt.value === condition);
    return option ? option.icon : AlertTriangle;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const openEditForm = (rule) => {
    setEditingRule(rule);
    setFormData({
      condition: rule.condition,
      threshold: rule.threshold.toString(),
      action: rule.action
    });
    setShowCreateForm(true);
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setEditingRule(null);
    setFormData({ condition: '', threshold: '', action: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Automation</h1>
          <p className="text-gray-400">Configure automated responses to security events</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rules'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Automation Rules
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Action Logs
              </button>
            </nav>
          </div>
        </div>

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div>
            {/* Create Rule Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Rule
              </button>
            </div>

            {/* Rules List */}
            <div className="grid gap-4">
              {rules.map((rule) => {
                const ConditionIcon = getConditionIcon(rule.condition);
                return (
                  <div
                    key={rule.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${rule.active ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          <ConditionIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {getConditionLabel(rule.condition)}
                          </h3>
                          <p className="text-gray-400">
                            Threshold: {rule.threshold}% | Action: {getActionLabel(rule.action)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRuleStatus(rule.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            rule.active
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                          }`}
                        >
                          {rule.active ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => openEditForm(rule)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rule.active ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Action Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            <span className="text-white">
                              {getConditionLabel(log.condition)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          {log.value}%
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {log.action_taken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Rule Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a condition</option>
                    {conditionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Action
                  </label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select an action</option>
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingRule ? 'Update Rule' : 'Create Rule')}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Automation;