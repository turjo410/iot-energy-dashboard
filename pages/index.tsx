import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    Zap, Home, BarChart2, DollarSign, Settings, Bell, User, Search,
    CheckCircle, Wifi, Activity, TrendingUp, AlertTriangle, Lightbulb,
    Cpu, Snowflake, Refrigerator, LayoutDashboard, ChevronRight, HardDrive, MemoryStick, FilePieChart, Power, Quote,
    Target, BookOpen, BrainCircuit, Scale, Globe, Shield, Leaf, Briefcase, Landmark, Video, Image as ImageIcon, X
} from 'lucide-react';
import CountUp from 'react-countup';
import Papa from 'papaparse';
import { useRouter } from 'next/router';

// --- TYPE DEFINITIONS for your specific CSV structure ---
interface EnergyDataRow {
    Time: string;
    Voltage_V: number;
    Frequency_Hz: number;
    Current_A: number;
    ActivePower_kW: number;
    PowerFactor: number;
    ApparentPower_kVA: number;
    ReactivePower_kVAr: number;
    Energy_kWh: number;
    Cost_cum_BDT: number;
    PF_Class: 'Excellent' | 'Good' | 'Poor' | 'Bad';
    Compressor_ON: number; // 0 or 1
    'DutyCycle_%_24H': number;
    Cycle_ID: number;
    [key: string]: any; // Allow other columns
}

interface Device {
    name: string;
    icon: React.ElementType;
    status: 'On' | 'Off';
    power: number;
    details: string;
    basePower: number;
}


// --- Main App Component ---
export default function App() {
    const [energyData, setEnergyData] = useState<EnergyDataRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter(); 

    useEffect(() => {
        setIsClient(true);
        const csvPath = `${router.basePath}/data.csv`;

        Papa.parse(csvPath, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                const sortedData = (results.data as EnergyDataRow[]).sort((a, b) => new Date(a.Time).getTime() - new Date(b.Time).getTime());
                setEnergyData(sortedData);
                setIsLoading(false);
            },
            error: (error: any) => {
                console.error("Error fetching or parsing CSV:", error);
                setIsLoading(false);
                alert("Could not load data.csv. Please ensure it's in the /public folder and the basePath in next.config.js is correct.");
            }
        });
    }, [router.basePath]);

    if (!isClient || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Zap className="h-16 w-16 text-blue-500" />
                    </motion.div>
                    <p className="mt-4 text-xl">Loading Energy Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
            <DashboardLayout data={energyData} />
        </div>
    );
}

// --- Dashboard Layout ---
const DashboardLayout = ({ data }: { data: EnergyDataRow[] }) => {
    const [activeTab, setActiveTab] = useState('introduction');

    return (
        <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 flex flex-col h-screen">
                 {activeTab !== 'introduction' && <Header latestData={data[data.length - 1]} />}
                <main className={`flex-1 overflow-y-auto ${activeTab !== 'introduction' ? 'p-8' : ''} bg-slate-900`}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'introduction' && <IntroductionPage key="introduction" onNavigate={() => setActiveTab('dashboard')} />}
                        {activeTab === 'dashboard' && <DashboardPage key="dashboard" data={data} />}
                        {activeTab === 'analytics' && <AnalyticsPage key="analytics" data={data} />}
                        {activeTab === 'cost' && <CostPage key="cost" data={data} />}
                        {activeTab === 'devices' && <DevicesPage key="devices" data={data} />}
                        {/* FIX: Passed the 'data' prop to the ReportPage component */}
                        {activeTab === 'report' && <ReportPage key="report" data={data} />}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// --- Sidebar Component ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
    const navItems = [
        { id: 'introduction', name: 'Introduction', icon: BookOpen },
        { id: 'dashboard', name: 'Dashboard', icon: Home },
        { id: 'analytics', name: 'Analytics', icon: BrainCircuit },
        { id: 'cost', name: 'Cost', icon: DollarSign },
        { id: 'devices', name: 'Devices', icon: Settings },
        { id: 'report', name: 'Report', icon: FilePieChart }
    ];

    return (
        <motion.nav
            initial={{ x: -250 }} animate={{ x: 0 }}
            className="bg-slate-800/30 backdrop-blur-md w-64 shadow-2xl border-r border-slate-700 flex-shrink-0 h-screen flex flex-col p-6 z-20"
        >
            <div className="flex items-center mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg"><Zap className="h-8 w-8 text-white" /></div>
                <h1 className="ml-3 text-2xl font-bold text-white">Energy-Profiling</h1>
            </div>
            <ul className="space-y-3">
                {navItems.map((item) => (
                    <motion.li key={item.id} whileHover={{ scale: 1.05 }}>
                        <button
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left relative ${activeTab === item.id ? 'text-white' : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'}`}
                        >
                            {activeTab === item.id && <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                            <item.icon className="h-5 w-5 mr-4 ml-2" />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    </motion.li>
                ))}
            </ul>
            <div className="mt-auto p-4 bg-slate-700/50 rounded-xl border border-green-500/30">
                <div className="flex items-center mb-2"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /><span className="font-semibold text-green-300">System Online</span></div>
                <div className="flex items-center mt-2 text-xs text-green-400"><Wifi className="h-4 w-4 mr-1" /><span>Signal: Strong</span></div>
            </div>
        </motion.nav>
    );
};

// --- Header Component ---
const Header = ({ latestData }: { latestData: EnergyDataRow }) => (
    <header className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700 px-8 py-4 flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                <p className="text-gray-400">Welcome back, Shahriar Khan!</p>
            </div>
            <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-6 bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600">
                    <div className="flex items-center"><Activity className="h-4 w-4 text-green-400 mr-2" /><span className="text-sm font-medium text-gray-200">{latestData ? `${(latestData.ActivePower_kW * 1000).toFixed(0)} W` : 'N/A'}</span></div>
                    <div className="flex items-center"><Zap className="h-4 w-4 text-blue-400 mr-2" /><span className="text-sm font-medium text-gray-200">{latestData ? `${latestData.Voltage_V.toFixed(1)} V` : 'N/A'}</span></div>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors"><Bell className="h-5 w-5 text-gray-400" /></button>
                <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors"><Search className="h-5 w-5 text-gray-400" /></button>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><User className="h-5 w-5 text-white" /></div>
            </div>
        </div>
    </header>
);

// --- Page Components ---

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
        {children}
    </motion.div>
);

const IntroductionPage = ({ onNavigate }: { onNavigate: () => void }) => {
    const studentInfo = {
        name: "Shahriar Khan", id: "2022-3-60-016", course: "CSE407 - Green Computing",
        instructor: "Rashedul Amin Tuhin (RDA)", title: "IoT Based Real-Time Energy Monitoring"
    };

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
    const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } } };
    
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

    return (
        <AnimatedPage>
            <div ref={scrollRef}>
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="h-screen flex flex-col items-center justify-center text-center p-8 sticky top-0">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                        <div className="absolute left-1/2 top-1/4 h-[60rem] w-[80rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] bg-[radial-gradient(circle_at_50%_50%,#2563eb_0%,#1e3a8a_50%,transparent_100%)] opacity-20"></div>
                    </div>
                    <motion.p variants={itemVariants} className="text-4xl font-semibold leading-8 text-blue-400">{studentInfo.course}</motion.p>
                    <motion.h1 variants={itemVariants} className="mt-4 text-7xl font-bold tracking-tight text-white sm:text-9xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{studentInfo.title}</motion.h1>
                    <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-16 gap-y-8">
                        <div className="text-left text-4xl"><p className="text-gray-300"><span className="font-semibold text-white">Submitted By:</span> {studentInfo.name}</p><p className="text-gray-300"><span className="font-semibold text-white">Student ID:</span> {studentInfo.id}</p></div>
                        <div className="text-left text-4xl"><p className="text-gray-300"><span className="font-semibold text-white">Submitted To:</span> {studentInfo.instructor}</p></div>
                    </motion.div>
                </motion.div>

                <div className="relative z-10 bg-slate-900">
                    <InfoSection title="About The Project" icon={Target}>
                        This project, for the Green Computing course, demonstrates an end-to-end energy management system. Using IoT, it monitors a refrigerator's consumption, transforming raw data into actionable insights on a dynamic dashboard to promote energy efficiency and cost awareness.
                    </InfoSection>

                    <StickyHardwareSection
                        title="The IoT Device" name="TOMZN Wi-Fi Smart Meter 63A with TUYA APP"
                        imageUrl="https://img.drz.lazcdn.com/static/bd/p/af92c845f03cea3acefe999f63eba721.jpg_720x720q80.jpg_.webp"
                        specs={[
                            { icon: Zap, label: "Voltage Range", value: "AC80-400V" },
                            { icon: Activity, label: "Current Range", value: "1-63A" },
                            { icon: Wifi, label: "Connectivity", value: "2.4GHz Wi-Fi" },
                        ]}
                    >
                        The core of the system is the TOMZN Smart Meter. It measures critical electrical parameters like voltage, current, and active power, transmitting data wirelessly for real-time analysis.
                    </StickyHardwareSection>

                    <StickyHardwareSection
                        title="The Monitored Appliance" name="Sharp SJ-EX315E-SL 253 Liters Inverter Refrigerator"
                        imageUrl="https://www.startech.com.bd/image/cache/catalog/appliance/refrigerator/sj-ex315e-sl/sj-ex315e-sl-01-500x500.webp"
                        specs={[
                            { icon: Snowflake, label: "Type", value: "Direct Cool" },
                            { icon: HardDrive, label: "Capacity", value: "253 Liters" },
                            { icon: MemoryStick, label: "Compressor", value: "R600a" },
                        ]}
                        reverse
                    >
                        A standard household refrigerator was chosen for this study. Its cyclical consumption patterns serve as an excellent case study for identifying energy trends, duty cycles, and efficiency improvements.
                    </StickyHardwareSection>
                    
                    <ProjectGallery />

                    <div className="h-screen flex items-center justify-center flex-col text-center p-8">
                        <InfoSection title="Key Findings & Impact" icon={TrendingUp}>
                            This project proves low-cost IoT devices can yield valuable, high-resolution energy data. The analysis reveals distinct operational cycles, enabling precise calculation of duty cycles and energy costs, empowering users to reduce their carbon footprint and electricity bills.
                        </InfoSection>
                        <motion.button
                            onClick={onNavigate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center text-xl mx-auto mt-12"
                        >
                            Proceed to Dashboard <ChevronRight className="ml-2 h-6 w-6" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

const DashboardPage = ({ data }: { data: EnergyDataRow[] }) => {
    const latest = data[data.length - 1];
    return (
        <AnimatedPage>
            <div className="space-y-8">
                <AnimatedView>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard title="Total Energy Consumed" value={latest.Energy_kWh} unit="kWh" icon={Zap} />
                        <MetricCard title="Cumulative Cost" value={latest.Cost_cum_BDT} unit="BDT" icon={DollarSign} />
                        <MetricCard title="Peak Power" value={Math.max(...data.map(d => d.ActivePower_kW))} unit="kW" icon={TrendingUp} />
                        <MetricCard title="Average Power Factor" value={data.reduce((a,b)=>a+b.PowerFactor,0)/data.length} unit="" icon={Activity} />
                    </div>
                </AnimatedView>
                 <AnimatedView>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <LiveGauge title="Live Wattage" value={latest.ActivePower_kW * 1000} max={300} unit="W" color="#3b82f6" />
                        <LiveGauge title="Live Current" value={latest.Current_A} max={2} unit="A" color="#10b981" />
                        <PowerFactorAnalysis data={data} />
                    </div>
                </AnimatedView>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><PowerOverTimeChart data={data} /></div>
                    <InsightCard quote="The peaks on this graph represent moments of high energy demand. Identifying these patterns is the first step toward optimizing usage and reducing costs." />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2"><CostAnalysisChart data={data} /></div>
                    <InsightCard quote="This bar chart visually confirms the direct relationship between time and cumulative cost. The steeper the curve, the higher the rate of expense." />
                </div>
            </div>
        </AnimatedPage>
    );
};

const AnalyticsPage = ({ data }: { data: EnergyDataRow[] }) => {
    const dutyCycle = data.length > 0 ? data[data.length - 1]['DutyCycle_%_24H'] : 0;
    const latestRecord = data.length > 0 ? data[data.length - 1] : null;
    const powerDistribution = latestRecord ? [
        { name: 'Active', value: latestRecord.ActivePower_kW, fill: '#10b981' },
        { name: 'Reactive', value: latestRecord.ReactivePower_kVAr, fill: '#f59e0b' },
        { name: 'Apparent', value: latestRecord.ApparentPower_kVA, fill: '#3b82f6' },
    ] : [];

    return (
        <AnimatedPage>
            <div className="space-y-8">
                <PageHeader title="Advanced Analytics" description="A deeper look into your energy consumption patterns." />
                <AnimatedView>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2"><CompressorCycleChart data={data} /></div>
                        <DutyCycleGauge value={dutyCycle} />
                    </div>
                </AnimatedView>
                <AnimatedView>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PowerDistributionChart data={powerDistribution} />
                        <CurrentVsPowerChart data={data} />
                    </div>
                </AnimatedView>
            </div>
        </AnimatedPage>
    );
};

const CostPage = ({ data }: { data: EnergyDataRow[] }) => {
    const latest = data.length > 0 ? data[data.length - 1] : null;
    const totalCost = latest?.Cost_cum_BDT || 0;
    const totalKWh = latest?.Energy_kWh || 0;
    const avgCostPerKWh = totalKWh > 0 ? totalCost / totalKWh : 0;
    
    const tariffData = [
        { name: '0-75 kWh', rate: 5.26 }, { name: '76-200 kWh', rate: 7.20 },
        { name: '201-300 kWh', rate: 7.59 }, { name: '301-400 kWh', rate: 8.02 },
        { name: '401-600 kWh', rate: 12.67 }, { name: '601+ kWh', rate: 14.61 },
    ];

    return (
        <AnimatedPage>
            <div className="space-y-8">
                <PageHeader title="Cost Analysis" description="Detailed breakdown of your electricity expenses." />
                <AnimatedView>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total Cumulative Cost" value={totalCost} unit="BDT" icon={DollarSign} />
                        <MetricCard title="Total Energy Used" value={totalKWh} unit="kWh" icon={Zap} />
                        <MetricCard title="Avg. Cost per kWh" value={avgCostPerKWh} unit="BDT" icon={Activity} />
                    </div>
                </AnimatedView>
                <AnimatedView>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GlassmorphicCard>
                             <h3 className="text-xl font-semibold text-white mb-2">Bangladesh Tariff Structure</h3>
                             <p className="text-md text-slate-400 mb-4">Official residential electricity rates (2024).</p>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={tariffData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={80} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} />
                                    <Bar dataKey="rate" fill="#8b5cf6" name="Rate (BDT/kWh)" />
                                </BarChart>
                             </ResponsiveContainer>
                        </GlassmorphicCard>
                        <GlassmorphicCard>
                            <h3 className="text-xl font-semibold text-white mb-2">Return on Investment (ROI)</h3>
                             <p className="text-md text-slate-400 mb-4">Financial viability of this IoT monitoring solution.</p>
                             <div className="space-y-4 text-slate-300 text-lg">
                                <p>This section analyzes the ROI. Based on the project manual, the payback period is calculated from hardware costs and potential savings.</p>
                                <p className="font-semibold text-white">Example Calculation:</p>
                                <ul className="list-disc list-inside text-md space-y-1">
                                    <li>Hardware Cost: 1,500 BDT</li>
                                    <li>Potential Monthly Savings: 10% of a 1000 BDT bill = 100 BDT</li>
                                    <li className="font-bold text-white">Payback Period: 1500 / 100 = 15 months</li>
                                </ul>
                             </div>
                        </GlassmorphicCard>
                    </div>
                </AnimatedView>
            </div>
        </AnimatedPage>
    );
};

const DevicesPage = ({ data }: { data: EnergyDataRow[] }) => {
    const fridgeData = data.length > 0 ? data[data.length - 1] : null;

    const initialDevices: Device[] = [
        { name: 'Refrigerator', icon: Refrigerator, status: 'On', power: fridgeData?.ActivePower_kW ?? 0, details: 'Main cooling unit, connected to IoT plug.', basePower: fridgeData?.ActivePower_kW ?? 0.150 },
        { name: 'Air Conditioner', icon: Snowflake, status: 'Off', power: 0, details: 'Living room AC unit, currently offline.', basePower: 1.2 },
        { name: 'Computer & Office', icon: Cpu, status: 'Off', power: 0, details: 'Workstation and peripherals, currently offline.', basePower: 0.250 },
    ];

    const [devices, setDevices] = useState<Device[]>(initialDevices);

    const handleToggle = (deviceName: string) => {
        setDevices(currentDevices =>
            currentDevices.map(device => {
                if (device.name === deviceName) {
                    const newStatus = device.status === 'On' ? 'Off' : 'On';
                    let newPower = (newStatus === 'On') ? device.basePower : 0;
                    return { ...device, status: newStatus, power: newPower };
                }
                return device;
            })
        );
    };


    return (
        <AnimatedPage>
            <PageHeader title="Device Management" description="Overview and control of connected appliances." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                    <AnimatedView key={device.name}>
                        <GlassmorphicCard className={`border-l-4 ${device.status === 'On' ? 'border-green-500' : 'border-slate-600'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <device.icon className={`h-8 w-8 mr-4 ${device.status === 'On' ? 'text-green-400' : 'text-slate-500'}`} />
                                    <h3 className="text-xl font-bold text-white">{device.name}</h3>
                                </div>
                                <div className={`px-3 py-1 text-xs font-bold rounded-full ${device.status === 'On' ? 'bg-green-500/20 text-green-300' : 'bg-slate-600/50 text-slate-400'}`}>
                                    {device.status}
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-4 h-10">{device.details}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-2xl font-semibold text-white">
                                    {device.power?.toFixed(3)} <span className="text-lg text-slate-400">kW</span>
                                </div>
                                 <button onClick={() => handleToggle(device.name)} className={`p-2 rounded-full transition-colors ${device.status === 'On' ? 'bg-green-500/30 hover:bg-green-500/50' : 'bg-slate-600/50 hover:bg-slate-600/80'}`}>
                                    <Power className={`h-6 w-6 ${device.status === 'On' ? 'text-green-300' : 'text-slate-400'}`} />
                                </button>
                            </div>
                        </GlassmorphicCard>
                    </AnimatedView>
                ))}
            </div>
        </AnimatedPage>
    );
};

// FIX: Added 'data' prop to satisfy TypeScript during build
const ReportPage = ({ data }: { data: EnergyDataRow[] }) => {
    const swot = {
        Strengths: ["Low-cost hardware", "Real-time data visualization", "High-resolution data capture"],
        Weaknesses: ["Dependent on Wi-Fi stability", "Single point of failure (smart plug)", "Requires technical setup"],
        Opportunities: ["Scalable to whole-home monitoring", "Integration with smart assistants", "Predictive maintenance using ML"],
        Threats: ["Data privacy and security concerns", "Competition from utility-provided solutions", "Hardware longevity issues"]
    };
     const pestle = [
        { title: 'Political', icon: Landmark, content: 'Government rebates or policies promoting energy efficiency can increase the value proposition of such monitoring systems.' },
        { title: 'Economic', icon: Briefcase, content: 'Rising electricity tariffs make the cost-saving aspect of this project highly relevant. It provides a clear path to reducing household expenses.' },
        { title: 'Social', icon: Globe, content: 'A growing societal awareness of climate change and carbon footprints drives interest in personal energy management tools.' },
        { title: 'Technological', icon: Cpu, content: 'The decreasing cost and increasing capability of IoT devices make this project feasible for a wide audience. Advances in cloud computing and data analysis enhance its power.' },
        { title: 'Legal', icon: Scale, content: 'Data privacy regulations (like GDPR) must be considered, especially if data is stored in the cloud. The user must have full control and ownership of their data.' },
        { title: 'Environmental', icon: Leaf, content: 'By providing actionable insights, this project directly contributes to green computing principles by enabling users to reduce energy waste and lower their environmental impact.' }
    ];
    const [openAccordion, setOpenAccordion] = useState<string | null>(pestle[0].title);


    return (
        <AnimatedPage>
            <PageHeader title="Project Report Analysis" description="A visual summary of the strategic analyses required for the project." />
            <div className="space-y-12">
                <AnimatedView>
                     <h2 className="text-4xl font-bold text-white mb-8 text-center">SWOT Analysis</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnalysisCard title="Strengths" items={swot.Strengths} color="green" />
                        <AnalysisCard title="Weaknesses" items={swot.Weaknesses} color="yellow" />
                        <AnalysisCard title="Opportunities" items={swot.Opportunities} color="blue" />
                        <AnalysisCard title="Threats" items={swot.Threats} color="red" />
                     </div>
                </AnimatedView>
                <AnimatedView>
                     <h2 className="text-4xl font-bold text-white mb-8 text-center">PESTLE Analysis</h2>
                     <div className="space-y-4 max-w-4xl mx-auto">
                        {pestle.map(item => (
                            <AccordionItem 
                                key={item.title} title={item.title} icon={item.icon} content={item.content}
                                isOpen={openAccordion === item.title}
                                setOpen={() => setOpenAccordion(openAccordion === item.title ? null : item.title)}
                            />
                        ))}
                     </div>
                </AnimatedView>
                 <AnimatedView>
                    <GlassmorphicCard>
                        <h3 className="text-3xl font-bold text-white mb-4 text-center">Financial & Business Aspects</h3>
                        <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto">
                            This IoT solution offers a strong business case by directly translating energy data into financial savings. For a typical household, identifying and mitigating appliance inefficiencies can lead to a 10-15% reduction in monthly electricity bills. For businesses, this scales up significantly, impacting operational costs and improving the bottom line. The value proposition is clear: a small, one-time hardware investment provides continuous, long-term returns through optimized energy consumption.
                        </p>
                    </GlassmorphicCard>
                </AnimatedView>
            </div>
        </AnimatedPage>
    );
};


// --- Reusable UI Components ---
const AnimatedView = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }} transition={{ duration: 0.6, ease: "easeOut" }} >
            {children}
        </motion.div>
    );
};

const GlassmorphicCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 ${className}`}>
        {children}
    </div>
);

const PageHeader = ({ title, description }: { title: string, description: string }) => (
    <AnimatedView>
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">{title}</h1>
            <p className="text-lg text-slate-400 mt-1">{description}</p>
        </div>
    </AnimatedView>
);

const MetricCard = ({ title, value, unit, icon: Icon }: { title: string, value: number, unit: string, icon: React.ElementType }) => (
    <GlassmorphicCard>
        <div className="flex items-center justify-between"><p className="text-gray-400">{title}</p><Icon className="h-6 w-6 text-slate-500" /></div>
        <div className="text-4xl font-bold text-white mt-2">
            <CountUp end={value || 0} duration={2} decimals={2} preserveValue />
            <span className="text-2xl text-gray-400 ml-2">{unit}</span>
        </div>
    </GlassmorphicCard>
);

const InfoSection = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <AnimatedView>
        <div className="mx-auto max-w-4xl text-center py-16">
            <div className="flex items-center justify-center gap-x-4 mb-6">
                <Icon className="h-12 w-12 text-blue-400" />
                <h2 className="text-5xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-2xl text-gray-300">{children}</p>
        </div>
    </AnimatedView>
);

const StickyHardwareSection = ({ title, name, imageUrl, specs, children, reverse = false }: { title:string, name:string, imageUrl:string, specs: {icon: React.ElementType, label: string, value: string}[], children: React.ReactNode, reverse?: boolean}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    return (
        <div ref={ref} className="h-[120vh] grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16 items-center px-8 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <motion.div style={{ y: imageY }} className={`h-[80vh] sticky top-[10vh] flex items-center justify-center ${reverse ? 'lg:order-last' : ''}`}>
                <img src={imageUrl} alt={name} className="max-h-full w-auto object-contain" />
            </motion.div>
            <div className={`flex flex-col justify-center ${reverse ? 'lg:order-first' : ''}`}>
                <p className="text-lg font-semibold leading-7 text-blue-500">{title}</p>
                <h3 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">{name}</h3>
                <p className="mt-6 text-xl text-gray-300">{children}</p>
                <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 text-lg leading-7 text-gray-300">
                    {specs.map((spec) => (
                        <div key={spec.label} className="flex gap-x-4">
                            <dt className="flex-none"><spec.icon className="h-7 w-6 text-blue-400" aria-hidden="true" /></dt>
                            <dd>{spec.label}: <span className="font-semibold text-white">{spec.value}</span></dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

const ProjectGallery = () => {
    const [selectedMedia, setSelectedMedia] = useState<{src: string, type: string} | null>(null);
    const router = useRouter();
    
    const galleryItems = [
        { type: 'video', src: `${router.basePath}/gallery/video1.mp4`, thumbnail: 'https://placehold.co/600x800/1e293b/9ca3af?text=Project+Video+1' },
        { type: 'image', src: `${router.basePath}/gallery/image1.jpg`, thumbnail: `${router.basePath}/gallery/image1.jpg` },
        { type: 'image', src: `${router.basePath}/gallery/image2.jpg`, thumbnail: `${router.basePath}/gallery/image2.jpg` },
        { type: 'video', src: `${router.basePath}/gallery/video2.mp4`, thumbnail: 'https://placehold.co/600x800/1e293b/9ca3af?text=Project+Video+2' },
        { type: 'image', src: `${router.basePath}/gallery/image3.jpg`, thumbnail: `${router.basePath}/gallery/image3.jpg` },
    ];

    return (
        <InfoSection title="Project in Action" icon={ImageIcon}>
            <p className="mb-12">A collection of photos and videos showcasing the project setup and the dashboard in operation.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {galleryItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer aspect-[3/4]"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        onClick={() => setSelectedMedia(item)}
                        layoutId={`gallery-item-${index}`}
                    >
                        <img src={item.thumbnail} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.type === 'video' ? <Video className="h-16 w-16 text-white" /> : <ImageIcon className="h-16 w-16 text-white" />}
                        </div>
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedMedia(null)}
                    >
                        {selectedMedia.type === 'image' ? (
                             <motion.img layoutId={`gallery-item-${galleryItems.findIndex(i => i.src === selectedMedia.src)}`} src={selectedMedia.src} className="max-w-[90vw] max-h-[90vh] rounded-lg" />
                        ) : (
                            <video src={selectedMedia.src} controls autoPlay className="max-w-[90vw] max-h-[90vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
                        )}
                        <motion.button
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
                        >
                            <X className="h-6 w-6 text-white" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </InfoSection>
    );
};


const InsightCard = ({ quote }: { quote: string }) => (
    <GlassmorphicCard className="flex flex-col justify-center items-center text-center">
        <Quote className="h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg text-slate-300 italic">{quote}</p>
    </GlassmorphicCard>
);

const AnalysisCard = ({ title, items, color }: { title: string, items: string[], color: string }) => {
    const colors: { [key: string]: string } = {
        green: 'border-green-500 text-green-300', yellow: 'border-yellow-500 text-yellow-300',
        blue: 'border-blue-500 text-blue-300', red: 'border-red-500 text-red-300',
    };
    return (
        <div className={`bg-slate-800/50 p-8 rounded-xl border-t-4 ${colors[color]}`}>
            <h4 className={`text-3xl font-bold mb-4 ${colors[color]}`}>{title}</h4>
            <ul className="space-y-3 list-disc list-inside text-xl text-slate-200">
                {items.map(item => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );
};

const AccordionItem = ({ title, icon: Icon, content, isOpen, setOpen }: { title:string, icon: React.ElementType, content:string, isOpen:boolean, setOpen:()=>void }) => (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
        <button onClick={setOpen} className="w-full flex justify-between items-center p-6 text-left">
            <div className="flex items-center">
                <Icon className="h-8 w-8 text-blue-400 mr-4" />
                <span className="text-2xl font-semibold text-white">{title}</span>
            </div>
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}><ChevronRight className="h-8 w-8 text-slate-400" /></motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <p className="p-6 pt-0 text-xl text-slate-300">{content}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// --- Chart Components ---
const LiveGauge = ({ title, value, max, unit, color }: { title: string, value: number, max: number, unit: string, color: string }) => (
    <GlassmorphicCard className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value }]} startAngle={180} endAngle={0} barSize={20}>
                <RadialBar dataKey="value" cornerRadius={10} fill={color} background={{ fill: '#374151' }} />
                <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-white">{value.toFixed(value > 10 ? 0 : 2)}</text>
                 <text x="50%" y="95%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold" fill={color}>{unit}</text>
            </RadialBarChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const PowerOverTimeChart = ({ data }: { data: EnergyDataRow[] }) => (
    <GlassmorphicCard className="h-full">
        <h3 className="text-lg font-semibold text-white mb-1">Active Power Over Time</h3>
        <p className="text-sm text-slate-400 mb-4">Tracks the real-time power consumption in kilowatts (kW).</p>
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs><linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="Time" stroke="#9CA3AF" fontSize={10} tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 'dataMax + 0.1']} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Area type="monotone" dataKey="ActivePower_kW" stroke="#3b82f6" strokeWidth={2} fill="url(#powerGradient)" />
            </AreaChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const PowerFactorAnalysis = ({ data }: { data: EnergyDataRow[] }) => {
    const avgPF = data.reduce((acc, d) => acc + d.PowerFactor, 0) / data.length;
    const pfClass = avgPF > 0.95 ? 'Excellent' : avgPF > 0.9 ? 'Good' : 'Poor';
    const colorMap = { Excellent: '#10b981', Good: '#3b82f6', Poor: '#f59e0b' };

    return (
        <GlassmorphicCard className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-1">Power Factor Analysis</h3>
            <p className="text-sm text-slate-400 mb-2">Measures the efficiency of your power usage.</p>
             <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: avgPF * 100 }]} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={10} fill={colorMap[pfClass]} background={{ fill: '#374151' }} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-white">{avgPF.toFixed(2)}</text>
                     <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold" fill={colorMap[pfClass]}>{pfClass}</text>
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="mt-auto bg-slate-700/50 p-3 rounded-lg flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-300 mr-3 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-yellow-300">Analytics Tip</h4>
                    <p className="text-xs text-slate-300">A power factor below 0.95 may lead to higher utility bills. Improving it can lead to significant savings.</p>
                </div>
            </div>
        </GlassmorphicCard>
    );
};

const CostAnalysisChart = ({ data }: { data: EnergyDataRow[] }) => (
    <GlassmorphicCard>
        <h3 className="text-lg font-semibold text-white mb-1">Cumulative Cost Over Time</h3>
        <p className="text-sm text-slate-400 mb-4">Shows the total electricity cost in BDT accumulating over the dataset period.</p>
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="Time" stroke="#9CA3AF" fontSize={10} tickFormatter={(time) => new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' })} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} labelFormatter={(label) => new Date(label).toLocaleString()} />
                <Bar dataKey="Cost_cum_BDT" fill="#8b5cf6" />
            </BarChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const CompressorCycleChart = ({ data }: { data: EnergyDataRow[] }) => (
    <GlassmorphicCard>
        <h3 className="text-lg font-semibold text-white mb-1">Compressor On/Off Cycles</h3>
        <p className="text-sm text-slate-400 mb-4">Visualizes the refrigerator's compressor activity, key to understanding its consumption pattern.</p>
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="Time" stroke="#9CA3AF" fontSize={10} tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <YAxis tickCount={2} stroke="#9CA3AF" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} />
                <Area type="step" dataKey="Compressor_ON" stroke="#fb923c" fill="#fb923c" fillOpacity={0.3} name="Compressor Status" />
            </AreaChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const DutyCycleGauge = ({ value }: { value: number }) => (
    <GlassmorphicCard className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-white mb-2">24H Duty Cycle</h3>
        <p className="text-sm text-slate-400 mb-4 text-center">The percentage of time the compressor was active.</p>
        <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value }]} startAngle={180} endAngle={0} barSize={20}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#fb923c" background={{ fill: '#374151' }} />
                <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-white">
                    {value.toFixed(1)}%
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const PowerDistributionChart = ({ data }: { data: { name: string, value: number, fill: string }[] }) => (
    <GlassmorphicCard>
        <h3 className="text-lg font-semibold text-white mb-1">Power Type Distribution</h3>
        <p className="text-sm text-slate-400 mb-4">Breakdown of the different power components in your system. Active power is the useful power, while reactive power is required by inductive loads.</p>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);

const CurrentVsPowerChart = ({ data }: { data: EnergyDataRow[] }) => (
    <GlassmorphicCard>
        <h3 className="text-lg font-semibold text-white mb-1">Current vs. Power Correlation</h3>
        <p className="text-sm text-slate-400 mb-4">This scatter plot shows the direct relationship between current drawn (Amps) and the active power consumed (kW).</p>
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
                 <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                 <XAxis type="number" dataKey="Current_A" name="Current" unit="A" stroke="#9CA3AF" fontSize={10} />
                 <YAxis type="number" dataKey="ActivePower_kW" name="Active Power" unit="kW" stroke="#9CA3AF" fontSize={10} />
                 <ZAxis type="number" range={[10, 200]} />
                 <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4A5568', borderRadius: '12px', color: '#FFF' }} />
                 <Scatter data={data} fill="#8b5cf6" opacity={0.6} shape="circle" />
            </ScatterChart>
        </ResponsiveContainer>
    </GlassmorphicCard>
);
