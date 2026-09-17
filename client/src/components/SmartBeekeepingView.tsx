import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiFetch';
import type { Hive, HiveAlert, SmartRecommendation, BeekeeperProfile } from '../types';
import { Cpu, AlertTriangle, Thermometer, Droplets, Heart, Sparkles, RefreshCw, Scale, ChevronDown, ChevronUp, Info, X, Zap, Activity } from 'lucide-react';

interface SmartBeekeepingViewProps {
  activeBeekeeper?: BeekeeperProfile;
}

export const SmartBeekeepingView: React.FC<SmartBeekeepingViewProps> = ({ activeBeekeeper }) => {
  const [hives, setHives] = useState<Hive[]>([]);
  const [alerts, setAlerts] = useState<HiveAlert[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [selectedHive, setSelectedHive] = useState<Hive | null>(null);
  const [expandedWhyHiveId, setExpandedWhyHiveId] = useState<string | null>(null);
  const [readinessFilter, setReadinessFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchTelemetry();
    // Live IoT polling interval: refresh every 3 seconds for live hardware telemetry
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [activeBeekeeper]);

  const fetchTelemetry = async () => {
    try {
      const q = activeBeekeeper ? `?beekeeper=${encodeURIComponent(activeBeekeeper.name)}&location=${encodeURIComponent(activeBeekeeper.location)}` : '';
      const res = await apiFetch(`/api/hives${q}`);
      const data = await res.json();
      setHives(data.hives || []);
      setAlerts(data.alerts || []);
      setRecommendations(data.recommendations || []);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredHives = hives.filter(h => {
    if (readinessFilter === 'ALL') return true;
    return h.ai?.harvestReadiness === readinessFilter;
  });

  const getReadinessBadge = (readiness?: string) => {
    switch (readiness) {
      case 'READY':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">READY FOR HARVEST</span>;
      case 'APPROACHING':
        return <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">APPROACHING HARVEST</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200 uppercase">NOT READY</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">Smart Beekeeping & AI-Assisted Hive Analysis</h2>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 uppercase tracking-wider font-mono">
                  ESP32 IoT Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule-based hive telemetry correlation, colony health indicators, stress metrics, and yield prediction algorithms
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchTelemetry}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 transition-colors flex items-center space-x-1.5"
              title="Refresh Telemetry"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Sensor Feeds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Apiary Summary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Apiary Health Index</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {hives.length > 0
              ? Math.round(hives.reduce((acc, h) => acc + (h.ai?.colonyHealth || 85), 0) / hives.length)
              : 87}%
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Optimal brood temperature & queen activity.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Harvest Readiness</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-800 font-mono">
            {hives.filter(h => h.ai?.harvestReadiness === 'READY').length} / {hives.length} Hives
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Honey cap level &gt; 80% with low moisture.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Predicted Honey Yield</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {hives.reduce((acc, h) => acc + (h.ai?.harvestPrediction.expectedYieldKg || 0), 0).toFixed(1)} kg
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Estimated harvest volume across active apiaries.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Active Telemetry Alerts</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600 font-mono">
            {alerts.filter(a => !a.resolved).length} Alerts
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Sensor threshold breaches requiring action.</p>
        </div>
      </div>

      {/* AI Recommendations Container */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-slate-100">AI-ASSISTED HIVE ANALYSIS & RECOMMENDATIONS</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
            Rule-Based IoT Correlations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-mono font-bold">
                  <span>{rec.hive_id} — {rec.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                    rec.type === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {rec.type}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">{rec.recommendation}</p>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-700/50">
                Data correlation: Sensor telemetry threshold
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Apiary Hives Grid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-amber-600" />
            <span>Apiary Hive Telemetry Grid</span>
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Filter Readiness:</span>
            {['ALL', 'READY', 'APPROACHING', 'NOT READY'].map(status => (
              <button
                key={status}
                onClick={() => setReadinessFilter(status)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  readinessFilter === status
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHives.map((h) => {
            const ai = h.ai;
            const isWhyExpanded = expandedWhyHiveId === h.hive_id;

            return (
              <div
                key={h.hive_id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Hive Title Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-base text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                        {h.hive_id}
                      </span>
                      <span className="text-xs font-bold text-slate-600">● Online</span>
                    </div>

                    <button
                      onClick={() => setSelectedHive(h)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors flex items-center space-x-1"
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </button>
                  </div>

                  {/* Harvest Readiness Badge */}
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-500">Harvest Status:</span>
                    {getReadinessBadge(ai?.harvestReadiness)}
                  </div>

                  {/* AI Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Colony Health</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-black text-emerald-700 font-mono">{ai?.colonyHealth || 85}%</span>
                        <Heart className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>

                    <div className="bg-red-50/60 p-3 rounded-xl border border-red-200/60">
                      <span className="text-[10px] font-extrabold text-red-800 uppercase block">Stress Risk</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-black text-red-600 font-mono">{ai?.stressRisk || 12}%</span>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                    </div>

                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Productivity</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-black text-amber-900 font-mono">{ai?.productivity || 'HIGH'} 📈</span>
                        <Zap className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>

                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/60">
                      <span className="text-[10px] font-extrabold text-blue-800 uppercase block">Est. Yield</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-black text-slate-900 font-mono">{ai?.harvestPrediction.expectedYieldKg || h.weight_kg} kg</span>
                        <Scale className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Sensor Gauges */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1 font-medium font-sans">
                        <Thermometer className="h-3.5 w-3.5 text-red-500" />
                        <span>Temp</span>
                      </span>
                      <span className={`font-extrabold ${h.temperature_c > 36 ? 'text-red-600' : 'text-slate-800'}`}>
                        {h.temperature_c}°C
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center space-x-1 font-medium font-sans">
                        <Droplets className="h-3.5 w-3.5 text-blue-500" />
                        <span>Humidity</span>
                      </span>
                      <span className="font-extrabold text-slate-800">{h.humidity_pct}%</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-sans">
                        <span className="text-slate-500 font-medium">Honey Reserve</span>
                        <span className="font-extrabold text-amber-900 font-mono">{h.honey_level_pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full"
                          style={{ width: `${h.honey_level_pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estimated Harvest Date */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-extrabold">Estimated Harvest:</span>
                    <span className="font-mono font-black text-amber-950">
                      {ai?.harvestPrediction.expectedDays === 0
                        ? 'Ready Now 🍯'
                        : `In ~${ai?.harvestPrediction.expectedDays || 3} Days`}
                    </span>
                  </div>

                  {/* WHY THIS RESULT Expandable Section */}
                  <div className="border-t border-slate-100 pt-2 space-y-2">
                    <button
                      onClick={() => setExpandedWhyHiveId(isWhyExpanded ? null : h.hive_id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-900 transition-colors p-1"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        <span>How this insight was generated</span>
                      </span>
                      {isWhyExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isWhyExpanded && (
                      <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs space-y-2 animate-fadeIn font-mono">
                        <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">AI-ASSISTED FACTOR WEIGHTING:</p>
                        <ul className="space-y-1.5 text-[11px] text-slate-300">
                          {(ai?.whyThisResult || [
                            'Hive weight increased consistently +1.8 kg / week.',
                            'Internal brood temp stable at optimal 35.2°C.',
                            'High honey cap level > 85% registered.',
                            'No critical humidity or disease anomalies recorded.'
                          ]).map((factor, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <span className="text-emerald-400 font-bold shrink-0">✓</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          * Simulated rule-based prediction model for SIH demo.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2 truncate font-mono">
                  Queen: {h.queen_status} | Weather: {h.weather_condition}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Hive Detail Modal */}
      {selectedHive && (() => {
        const liveModalHive = hives.find(h => h.hive_id === selectedHive.hive_id) || selectedHive;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-2xl text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                    {liveModalHive.hive_id}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{liveModalHive.apiary_name} Details</h3>
                    <p className="text-xs text-slate-500">📍 {liveModalHive.location} • Status: <strong className="text-emerald-700">● Online</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHive(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* AI Insights Diagnostic Card */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-slate-100">DIAGNOSTIC AI INSIGHT</h4>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
                    {liveModalHive.ai?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Colony Health</span>
                    <span className="text-lg font-black text-emerald-400">{liveModalHive.ai?.colonyHealth}%</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Stress Risk</span>
                    <span className="text-lg font-black text-red-400">{liveModalHive.ai?.stressRisk}%</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Yield Est.</span>
                    <span className="text-lg font-black text-amber-400">{liveModalHive.ai?.harvestPrediction.expectedYieldKg} kg</span>
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Confidence</span>
                    <span className="text-lg font-black text-blue-400">{liveModalHive.ai?.harvestPrediction.confidencePct}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  💡 {liveModalHive.ai?.recommendation}
                </p>
              </div>

              {/* Complete Hive Telemetry Parameters */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900">Current Sensor Telemetry</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Internal Temperature</span>
                    <span className="font-extrabold text-slate-900 text-sm">{liveModalHive.temperature_c}°C</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Relative Humidity</span>
                    <span className="font-extrabold text-slate-900 text-sm">{liveModalHive.humidity_pct}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Total Scale Weight</span>
                    <span className="font-extrabold text-slate-900 text-sm">{liveModalHive.weight_kg} kg</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Colony Strength</span>
                    <span className="font-extrabold text-emerald-700 text-sm font-sans">{liveModalHive.colony_strength}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Queen Status</span>
                    <span className="font-extrabold text-slate-900 text-sm font-sans">{liveModalHive.queen_status}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Pest Risk Metric</span>
                    <span className="font-extrabold text-amber-800 text-sm font-sans">{liveModalHive.pest_risk}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedHive(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs transition-colors"
                >
                  CLOSE HIVE DETAILS
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
