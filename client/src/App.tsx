import { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';

// Subscription tier data
const SUBSCRIPTION_TIERS = [
  {
    name: 'Starter',
    slug: 'starter',
    price: { monthly: 49, yearly: 490 },
    tagline: 'Perfect for teams of 5 or less',
    limits: { users: 5, employees: 25, projects: 5, aiQueriesPerMonth: 100 },
    features: [
      { name: 'AI Dashboard', included: true },
      { name: 'Employee Wellbeing', included: true },
      { name: 'AI Catalyst Chat', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Integrations', included: false },
      { name: 'API Access', included: false },
      { name: 'SSO / SAML', included: false },
    ],
    integrations: [],
  },
  {
    name: 'Professional',
    slug: 'professional',
    price: { monthly: 149, yearly: 1490 },
    tagline: 'Most popular for mid-size teams',
    limits: { users: 20, employees: 100, projects: 25, aiQueriesPerMonth: 500 },
    features: [
      { name: 'AI Dashboard', included: true },
      { name: 'Employee Wellbeing', included: true },
      { name: 'AI Catalyst Chat', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Integrations', included: true },
      { name: 'API Access', included: true },
      { name: 'SSO / SAML', included: false },
    ],
    integrations: ['Google Drive', 'Google Sheets', 'Microsoft Excel', 'Asana', 'Slack', 'Notion'],
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    price: { monthly: 499, yearly: 4990 },
    tagline: 'Unlimited everything + white-glove service',
    limits: { users: 'Unlimited', employees: 'Unlimited', projects: 'Unlimited', aiQueriesPerMonth: 'Unlimited' },
    features: [
      { name: 'AI Dashboard', included: true },
      { name: 'Employee Wellbeing', included: true },
      { name: 'AI Catalyst Chat', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Integrations', included: true },
      { name: 'API Access', included: true },
      { name: 'SSO / SAML', included: true },
    ],
    integrations: ['Google Drive', 'Google Sheets', 'Microsoft Excel', 'Asana', 'Slack', 'Notion', 'Salesforce', 'Jira', 'Zapier'],
  },
];

const AVAILABLE_INTEGRATIONS = [
  { id: 'google-drive', name: 'Google Drive', description: 'Import documents and export reports', tier: 'professional', icon: '📁' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Import employee data and export analytics', tier: 'professional', icon: '📊' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Sync check-ins and deadlines', tier: 'professional', icon: '📅' },
  { id: 'microsoft-excel', name: 'Microsoft Excel', description: 'Import and export spreadsheets', tier: 'professional', icon: '📗' },
  { id: 'microsoft-word', name: 'Microsoft Word', description: 'Generate reports as Word docs', tier: 'professional', icon: '📘' },
  { id: 'asana', name: 'Asana', description: 'Sync projects and tasks', tier: 'professional', icon: '✅' },
  { id: 'slack', name: 'Slack', description: 'Get alerts and use AI Catalyst in Slack', tier: 'professional', icon: '💬' },
  { id: 'notion', name: 'Notion', description: 'Sync documentation and knowledge bases', tier: 'professional', icon: '📝' },
  { id: 'jira', name: 'Jira', description: 'Integrate with software development teams', tier: 'enterprise', icon: '🎫' },
  { id: 'salesforce', name: 'Salesforce', description: 'Connect for sales team management', tier: 'enterprise', icon: '☁️' },
  { id: 'zapier', name: 'Zapier', description: 'Connect to 5,000+ apps', tier: 'enterprise', icon: '⚡' },
];

const HELP_GUIDE = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: [
      { title: 'Welcome to AetherFlow', description: 'AetherFlow is an AI-powered business operating system.', steps: ['Complete your organization profile', 'Add your first team members', 'Explore the Dashboard', 'Try the AI Catalyst'] },
      { title: 'Adding Employees', description: 'Add employees to track wellbeing and assign to teams.', steps: ['Go to Team page', 'Click Add Employee', 'Fill in details', 'Assign to a team'] },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    content: [
      { title: 'AI Catalyst Chat', description: 'Your confidential AI coach for leadership situations.', steps: ['Click AI Catalyst in sidebar', 'Ask management questions', 'Get advice on difficult conversations'] },
      { title: 'Burnout Detection', description: 'Monitors for signs of employee burnout.', steps: ['AI analyzes work patterns', 'At Risk employees appear on dashboard', 'Schedule check-ins directly'] },
    ],
  },
  {
    id: 'industry-modules',
    title: 'Industry Modules',
    content: [
      { title: 'Switching Industries', description: 'AetherFlow adapts to your industry.', steps: ['Go to Settings', 'Find Industry Type', 'Choose: Business, Healthcare, Education, or Construction'] },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    content: [
      { title: 'Connecting Apps', description: 'Professional and Enterprise plans can connect external apps.', steps: ['Go to Settings → Integrations', 'Click Connect next to your app', 'Follow authorization steps'] },
    ],
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    content: [
      { title: 'User Roles', description: 'Different permission levels.', steps: ['Owner: Full access + billing', 'Admin: Full access except billing', 'Manager: Manage assigned teams', 'Member: View assigned data'] },
    ],
  },
];

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_name: string;
  plan: string;
  industry_type?: string;
  is_super_admin?: boolean;
}

interface OrgDocument {
  id: string;
  title: string;
  document_type: string;
  file_name: string;
  created_at: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<OrgDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'documents' | 'integrations' | 'help'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('policy');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [expandedGuide, setExpandedGuide] = useState<string | null>('getting-started');

  const API_URL = import.meta.env.VITE_API_URL || 'https://aetherflow-api-production.up.railway.app';
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadProfile();
    loadDocuments();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/documents/organization`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleIndustryChange = async (industry: string) => {
    if (!profile?.is_super_admin) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/dashboard/industry`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ industry_type: industry })
      });
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, industry_type: industry } : null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update industry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { setUploadError('Please select a file'); return; }
    setUploadError('');
    setUploadSuccess('');
    setSaving(true);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle || uploadFile.name);
    formData.append('document_type', uploadType);

    try {
      const res = await fetch(`${API_URL}/api/documents/organization/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setUploadSuccess('Document uploaded successfully!');
        setUploadFile(null);
        setUploadTitle('');
        loadDocuments();
        const fileInput = document.getElementById('doc-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const error = await res.json();
        setUploadError(error.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`${API_URL}/api/documents/organization/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const currentTier = SUBSCRIPTION_TIERS.find(t => t.slug === profile?.plan) || SUBSCRIPTION_TIERS[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and organization</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-700 pb-4">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'organization', label: 'Organization' },
            { id: 'documents', label: 'Documents' },
            { id: 'integrations', label: 'Integrations' },
            { id: 'help', label: 'Help Guide' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.id === 'profile' && <Icons.People className="w-4 h-4" />}
              {tab.id === 'organization' && <Icons.Building className="w-4 h-4" />}
              {tab.id === 'documents' && <Icons.Document className="w-4 h-4" />}
              {tab.id === 'integrations' && <Icons.Settings className="w-4 h-4" />}
              {tab.id === 'help' && <Icons.Brain className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Your Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <p className="text-white text-lg">{profile?.first_name} {profile?.last_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <p className="text-white text-lg">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-400 capitalize">{profile?.role}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Organization</label>
                <p className="text-white text-lg">{profile?.organization_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Organization Tab */}
        {activeTab === 'organization' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Current Plan</h2>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30">
                <div>
                  <p className="text-2xl font-bold text-white">{currentTier.name}</p>
                  <p className="text-slate-400">{currentTier.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">${currentTier.price.monthly}<span className="text-sm text-slate-400">/mo</span></p>
                  <button className="mt-2 px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm font-medium hover:bg-indigo-700 transition">Upgrade Plan</button>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{currentTier.limits.users}</p>
                  <p className="text-sm text-slate-400">Users</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{currentTier.limits.employees}</p>
                  <p className="text-sm text-slate-400">Employees</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{currentTier.limits.projects}</p>
                  <p className="text-sm text-slate-400">Projects</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{currentTier.limits.aiQueriesPerMonth}</p>
                  <p className="text-sm text-slate-400">AI Queries/mo</p>
                </div>
              </div>
            </div>

            {profile?.is_super_admin && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Industry Type</h2>
                <p className="text-slate-400 text-sm mb-4">Change your dashboard to match your industry</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'professional', name: 'Business' },
                    { id: 'healthcare', name: 'Healthcare' },
                    { id: 'education', name: 'Education' },
                    { id: 'construction', name: 'Construction' },
                  ].map(industry => (
                    <button
                      key={industry.id}
                      onClick={() => handleIndustryChange(industry.id)}
                      disabled={saving}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        profile?.industry_type === industry.id ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                    >
                      <Icons.Building className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                      <p className="text-white font-medium">{industry.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Organization Document</h2>
              <p className="text-slate-400 text-sm mb-6">Upload policies, handbooks, or other documents. The AI will analyze them.</p>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Document Title</label>
                    <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g., Employee Handbook 2026" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Document Type</label>
                    <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="policy">Policy</option>
                      <option value="handbook">Handbook</option>
                      <option value="procedure">Procedure</option>
                      <option value="training">Training Material</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Select File</label>
                  <input id="doc-file" type="file" accept=".pdf,.txt,.md,.csv,.docx" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer" />
                  <p className="text-slate-500 text-xs mt-1">Accepted: PDF, TXT, MD, CSV, DOCX (max 10MB)</p>
                </div>
                {uploadError && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{uploadError}</div>}
                {uploadSuccess && <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">{uploadSuccess}</div>}
                <button type="submit" disabled={saving || !uploadFile} className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Uploaded Documents</h2>
              {documents.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No documents uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Icons.Document className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{doc.title}</p>
                          <p className="text-slate-400 text-sm">{doc.document_type} • {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {!['professional', 'enterprise'].includes(profile?.plan || '') ? (
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-500/30 p-8 text-center">
                <Icons.Lock className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Integrations require Professional or Enterprise</h2>
                <p className="text-slate-400 mb-6">Connect Google Drive, Excel, Slack, Asana and more with an upgraded plan.</p>
                <button className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition">Upgrade to Professional</button>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Available Integrations</h2>
                <p className="text-slate-400 text-sm mb-6">Connect your favorite tools to AetherFlow</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AVAILABLE_INTEGRATIONS.map(integration => {
                    const isAvailable = integration.tier === 'professional' ? ['professional', 'enterprise'].includes(profile?.plan || '') : profile?.plan === 'enterprise';
                    return (
                      <div key={integration.id} className={`p-4 rounded-xl border transition ${isAvailable ? 'bg-slate-700/30 border-slate-600 hover:border-indigo-500' : 'bg-slate-800/30 border-slate-700 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center text-lg">{integration.icon}</div>
                            <div>
                              <p className="text-white font-medium">{integration.name}</p>
                            </div>
                          </div>
                          {!isAvailable && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Enterprise</span>}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{integration.description}</p>
                        <button disabled={!isAvailable} className={`w-full py-2 rounded-lg text-sm font-medium transition ${isAvailable ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                          {isAvailable ? 'Connect' : 'Requires Enterprise'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Guide Tab */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Help Guide</h2>
              <p className="text-slate-400 text-sm mb-6">Learn how to use AetherFlow effectively</p>
              <div className="space-y-4">
                {HELP_GUIDE.map(section => (
                  <div key={section.id} className="border border-slate-700 rounded-2xl overflow-hidden">
                    <button onClick={() => setExpandedGuide(expandedGuide === section.id ? null : section.id)} className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-lg">
                          {section.id === 'getting-started' && '🚀'}
                          {section.id === 'ai-features' && '🧠'}
                          {section.id === 'industry-modules' && '🏢'}
                          {section.id === 'integrations' && '🔗'}
                          {section.id === 'account-billing' && '💳'}
                        </div>
                        <span className="text-white font-medium">{section.title}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedGuide === section.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {expandedGuide === section.id && (
                      <div className="p-4 bg-slate-800/30 border-t border-slate-700 space-y-6">
                        {section.content.map((item, idx) => (
                          <div key={idx}>
                            <h4 className="text-white font-medium mb-2">{item.title}</h4>
                            <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                            {item.steps && (
                              <ol className="list-decimal list-inside space-y-1">
                                {item.steps.map((step, stepIdx) => (<li key={stepIdx} className="text-slate-300 text-sm">{step}</li>))}
                              </ol>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need More Help?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <a href="#" className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition">
                  <p className="text-white font-medium">📧 Email Support</p>
                  <p className="text-slate-400 text-sm">support@aetherflow.com</p>
                </a>
                <a href="#" className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition">
                  <p className="text-white font-medium">📚 Documentation</p>
                  <p className="text-slate-400 text-sm">View full docs</p>
                </a>
                <a href="#" className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition">
                  <p className="text-white font-medium">💬 Live Chat</p>
                  <p className="text-slate-400 text-sm">Pro & Enterprise only</p>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
