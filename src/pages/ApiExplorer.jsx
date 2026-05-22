import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import ApiKeyBar from '../components/api-explorer/ApiKeyBar';
import EndpointSidebar from '../components/api-explorer/EndpointSidebar';
import RequestPanel from '../components/api-explorer/RequestPanel';
import ResponsePanel from '../components/api-explorer/ResponsePanel';
import { Terminal } from 'lucide-react';
import { ENDPOINTS, isValidKey } from '../lib/api-endpoints';

export default function ApiExplorer() {
  const [apiKey, setApiKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [response, setResponse] = useState(null);

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpoint(ep);
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center shadow-sm">
              <Terminal className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">API Explorer</h1>
              <p className="text-sm text-[#8898AA]">Test your API keys and execute live requests right in the browser.</p>
            </div>
          </div>

          {/* API Key bar */}
          <div className="mb-6">
            <ApiKeyBar apiKey={apiKey} setApiKey={setApiKey} keyValid={isValidKey(apiKey)} />
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Sidebar */}
            <EndpointSidebar
              endpoints={ENDPOINTS}
              selected={selectedEndpoint}
              onSelect={handleSelectEndpoint}
            />

            {/* Request + Response */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <RequestPanel
                endpoint={selectedEndpoint}
                apiKey={apiKey}
                onResult={setResponse}
              />
              <ResponsePanel result={response} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}