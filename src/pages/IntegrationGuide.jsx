import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import GuideApiKeys from '../components/integration-guide/GuideApiKeys';
import GuideRequestExamples from '../components/integration-guide/GuideRequestExamples';
import GuideEventTypes from '../components/integration-guide/GuideEventTypes';
import { BookOpen, Key, Code2, Zap } from 'lucide-react';

const TABS = [
  { id: 'keys',     label: 'Your API Keys',     Icon: Key },
  { id: 'examples', label: 'Request Examples',  Icon: Code2 },
  { id: 'events',   label: 'Webhook Events',    Icon: Zap },
];

export default function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState('keys');
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ApiKey.filter({ status: 'active' }, '-created_date', 20)
      .then(keys => {
        setApiKeys(keys);
        if (keys.length > 0) setSelectedKey(keys[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">Integration Guide</h1>
            </div>
            <p className="text-sm text-[#8898AA] ml-12">
              Your personal integration hub — API keys, live code examples, and webhook event catalog.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-8 w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'text-[#425466] hover:text-[#0A2540] hover:bg-gray-50'
                }`}
              >
                <tab.Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'keys' && (
            <GuideApiKeys
              apiKeys={apiKeys}
              loading={loading}
              selectedKey={selectedKey}
              onSelectKey={setSelectedKey}
            />
          )}
          {activeTab === 'examples' && (
            <GuideRequestExamples apiKeys={apiKeys} selectedKey={selectedKey} onSelectKey={setSelectedKey} />
          )}
          {activeTab === 'events' && (
            <GuideEventTypes />
          )}
        </div>
      </div>
    </div>
  );
}