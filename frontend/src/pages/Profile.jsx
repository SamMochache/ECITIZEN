import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    id: null,
    username: '',
    email: '',
    phone: '',
    is_verified: false
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityNotifications: true,
    systemUpdates: false,
    weeklyReports: true
  });

  // Mock API calls - replace with actual API endpoints
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/users/profile/', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockProfile = {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        is_verified: true
      };
      
      setUserProfile(mockProfile);
      setEditData(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setEditData(userProfile);
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/users/profile/', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(editData)
      // });
      // const data = await response.json();
      
      // Mock successful update
      console.log('Updating profile:', editData);
      setUserProfile(editData);
      setEditMode(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    setSaving(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/users/change-password/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     old_password: passwordData.currentPassword,
      //     new_password: passwordData.newPassword
      //   })
      // });
      
      console.log('Changing password:', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async (setting, value) => {
    const updatedNotifications = { ...notifications, [setting]: value };
    setNotifications(updatedNotifications);
    
    try {
      // Replace with actual API call
      // await fetch('/api/users/notification-settings/', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(updatedNotifications)
      // });
      
      console.log('Updated notifications:', updatedNotifications);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Shield size={16} />
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Bell size={16} />
                Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User size={20} />
                Profile Information
              </h2>
              <button
                onClick={handleEditToggle}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  editMode
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {editMode ? <X size={16} /> : <Edit3 size={16} />}
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.username || ''}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    {userProfile.username}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                  {userProfile.is_verified && (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white flex items-center justify-between">
                    {userProfile.email}
                    {!userProfile.is_verified && (
                      <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                        Unverified
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    {userProfile.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User ID
                </label>
                <div className="bg-gray-700 rounded-lg px-3 py-2 text-gray-400">
                  #{userProfile.id}
                </div>
              </div>
            </div>

            {editMode && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password Change */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Key size={20} />
                Change Password
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Lock size={16} />
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Shield size={20} />
                Account Security
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {userProfile.is_verified ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <AlertCircle size={20} className="text-yellow-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">Email Verification</p>
                      <p className="text-gray-400 text-sm">
                        {userProfile.is_verified ? 'Your email is verified' : 'Please verify your email'}
                      </p>
                    </div>
                  </div>
                  {!userProfile.is_verified && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {Object.entries({
                emailAlerts: 'Email Security Alerts',
                securityNotifications: 'Security Event Notifications',
                systemUpdates: 'System Update Notifications',
                weeklyReports: 'Weekly Security Reports'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-gray-400 text-sm">
                      {key === 'emailAlerts' && 'Receive alerts when security events are detected'}
                      {key === 'securityNotifications' && 'Get notified about security incidents'}
                      {key === 'systemUpdates' && 'Updates about system maintenance and features'}
                      {key === 'weeklyReports' && 'Weekly summary of security activity'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) => handleNotificationUpdate(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;