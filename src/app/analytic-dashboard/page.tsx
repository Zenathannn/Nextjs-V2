'use client';

import React, {useState, useEffect, useCallback} from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {Minimize2, Users, DollarSign, ShoppingCart, TrendingUp, Calendar, RefreshCw} from 'lucide-react';
import Link from 'next/link';

const COLOR = ['#3b82f6','#10b981','#f59e0b','#ef4444'];

type FilterOption = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thismonth' | 'lastmonth' | 'thisyear' |'lastyear'| 'alltime';
type BarDatum = {name: string; value: number; target: number;};
type LineDatum = {name: string; sales: number; revenue: number;};
type PieDatum = {name: string; value: number;};
type Stats = {users: number; revenue: number; orders: number; growth: string;};

const dateFilterOptions: { value: FilterOption; label: string }[] = [
    { value: 'today',      label: 'Today' },
    { value: 'yesterday',  label: 'Yesterday' },
    { value: 'last7days',  label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth',  label: 'This Month' },
    { value: 'lastmonth',  label: 'Last Month' },
    { value: 'thisyear',   label: 'This Year' },
    { value: 'lastyear',   label: 'Last Year' },
    { value: 'alltime',    label: 'All Time' },
];

const generateDataByFilter = (filter: FilterOption) => {
    const multiplier: Record<FilterOption, number> = {
        today: 1, yesterday: 0.25, last7days: 0.6, last30days: 1,
        thismonth: 1.1, lastmonth: 0.9, thisyear: 1.5, lastyear: 1.3, alltime: 2,
    };
    const mult = multiplier[filter] ?? 1;
    return {
        Bar: [
            { name: 'Jan', value: Math.round(4000 * mult), target: Math.round(3500 * mult) },
            { name: 'Feb', value: Math.round(3000 * mult), target: Math.round(3200 * mult) },
            { name: 'Mar', value: Math.round(5000 * mult), target: Math.round(4000 * mult) },
            { name: 'Apr', value: Math.round(4500 * mult), target: Math.round(4200 * mult) },
            { name: 'May', value: Math.round(6000 * mult), target: Math.round(5000 * mult) },
            { name: 'Jun', value: Math.round(5500 * mult), target: Math.round(5200 * mult) },
        ] as BarDatum[],
        Line: [
            { name: 'Week 1', sales: Math.round(2400 * mult), revenue: Math.round(3400 * mult) },
            { name: 'Week 2', sales: Math.round(1398 * mult), revenue: Math.round(2210 * mult) },
            { name: 'Week 3', sales: Math.round(9800 * mult), revenue: Math.round(4290 * mult) },
            { name: 'Week 4', sales: Math.round(3908 * mult), revenue: Math.round(3000 * mult) },
        ] as LineDatum[],
        pie: [
            { name: 'Kelas A', value: Math.round(400 * mult) },
            { name: 'Kelas B', value: Math.round(300 * mult) },
            { name: 'Kelas C', value: Math.round(200 * mult) },
            { name: 'Kelas D', value: Math.round(100 * mult) },
        ] as PieDatum[],
        stats: {
            users: Math.round(12345 * mult),
            revenue: Math.round(45678 * mult),
            orders: Math.round(3456 * mult),
            growth: (23.5 * mult).toFixed(1)
        } as Stats
    };
};

export default function AnalyticDashboard() {
    const [dateFilter, setDateFilter] = useState<FilterOption>('last7days');
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [fullscreenType, setFullscreenType] = useState<'Bar' | 'Line' | 'Pie' | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const [barData, setBarData] = useState<BarDatum[]>([]);
    const [lineData, setLineData] = useState<LineDatum[]>([]);
    const [pieData, setPieData] = useState<PieDatum[]>([]);
    const [statsData, setStatsData] = useState<Stats | null>(null);

    // fix chart width(-1) error
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleFilterChange = (filter: FilterOption) => {
        setDateFilter(filter);
    };

    const handleManualRefresh = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const data = generateDataByFilter(dateFilter);
            setBarData(data.Bar);
            setLineData(data.Line);
            setPieData(data.pie);
            setStatsData(data.stats);
            setIsLoading(false);
        }, 500);
    }, [dateFilter]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const data = generateDataByFilter(dateFilter);
            setBarData(data.Bar);
            setLineData(data.Line);
            setPieData(data.pie);
            setStatsData(data.stats);
            setIsLoading(false);
        }, 500);
    }, [dateFilter]);

    useEffect(() => {
        if (!autoRefresh) {
            setCountdown(60);
            return;
        }
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    handleManualRefresh();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [autoRefresh, handleManualRefresh]);

    const statsCards = [
        { title: 'Total Users', value: statsData?.users ?? 0, icon: <Users className="w-6 h-6 text-white" />, bgColor: 'bg-blue-500' },
        { title: 'Total Revenue', value: `$${statsData?.revenue ?? 0}`, icon: <DollarSign className="w-6 h-6 text-white" />, bgColor: 'bg-green-500' },
        { title: 'Total Orders', value: statsData?.orders ?? 0, icon: <ShoppingCart className="w-6 h-6 text-white" />, bgColor: 'bg-yellow-500' },
        { title: 'Growth Rate', value: `${statsData?.growth ?? 0}%`, icon: <TrendingUp className="w-6 h-6 text-white" />, bgColor: 'bg-red-500' },
    ];

    if (!isMounted) return null;

    return (
        <div className='min-h-screen bg-gray-100 p-4 md:p-8'>
            <div className='max-w-7xl mx-auto'>

                {/* Fullscreen Modal */}
                {fullscreenType && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setFullscreenType(null)}>
                        <div className='bg-white rounded-lg p-6 w-full max-w-6xl h-[90vh]' onClick={(e) => e.stopPropagation()}>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-2xl font-bold text-gray-800'>
                                    {fullscreenType === 'Bar' && 'Monthly Performance'}
                                    {fullscreenType === 'Line' && 'Weekly Sales & Revenue'}
                                    {fullscreenType === 'Pie' && 'Distribution by Category'}
                                </h2>
                                <button onClick={() => setFullscreenType(null)} className='p-2 hover:bg-gray-100 rounded-lg'>
                                    <Minimize2 size={24} />
                                </button>
                            </div>
                            <div className='h-[calc(100%-80px)]'>
                                <ResponsiveContainer width="100%" height="100%">
                                    {fullscreenType === 'Bar' ? (
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" /><YAxis />
                                            <Tooltip /><Legend />
                                            <Bar dataKey='value' fill="#3b82f6" name="Actual" />
                                            <Bar dataKey="target" fill="#10b981" name="Target" />
                                        </BarChart>
                                    ) : fullscreenType === 'Line' ? (
                                        <LineChart data={lineData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" /><YAxis />
                                            <Tooltip /><Legend />
                                            <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" />
                                            <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                                        </LineChart>
                                    ) : (
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" labelLine={true}
                                                label={({ name, percent }) => `${name ?? 'Unknown'}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                                outerRadius={200} dataKey='value'>
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>Analytic Dashboard</h1>
                            <p className='text-gray-500 mt-1'>Real Time Analytics</p>
                            <p className='text-sm text-blue-600 mt-1'>
                                viewing data for: <strong>{dateFilterOptions.find(f => f.value === dateFilter)?.label}</strong>
                            </p>
                        </div>
                        <div className='flex items-center mt-4 md:mt-0'>
                            <Link href="/" className="text-sm text-indigo-600 hover:underline">
                                &larr; Kembali Ke Home
                            </Link>
                        </div>
                    </div>

                    <div className='mt-6 flex flex-col gap-4'>
                        {/* Date Filter */}
                        <div className='flex items-center gap-2 flex-wrap'>
                            <Calendar className='text-gray-500' size={20} />
                            {dateFilterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleFilterChange(option.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                        dateFilter === option.value
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Auto Refresh */}
                        <div className='flex items-center gap-4'>
                            <label className='text-sm text-gray-600'>Auto Refresh</label>
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`relative w-12 h-6 rounded-full transition ${autoRefresh ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            {autoRefresh && (
                                <span className='text-sm text-gray-500 font-mono'>{countdown}s</span>
                            )}
                            <button
                                onClick={handleManualRefresh}
                                disabled={isLoading}
                                className='flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50'
                            >
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                <span className='hidden sm:inline'>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    {statsCards.map((card, index) => (
                        <div key={index} className='bg-white rounded-lg shadow-md p-6 flex items-center gap-4'>
                            <div className={`${card.bgColor} p-3 rounded-lg`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className='text-sm text-gray-500'>{card.title}</p>
                                <p className='text-2xl font-bold text-gray-800'>{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='bg-white rounded-lg shadow-md p-6 min-h-[350px]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>Monthly Performance</h2>
                            <button onClick={() => setFullscreenType('Bar')} className='p-1 hover:bg-gray-100 rounded text-xs text-gray-500'>⛶ Fullscreen</button>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" /><YAxis />
                                <Tooltip /><Legend />
                                <Bar dataKey='value' fill="#3b82f6" name="Actual" />
                                <Bar dataKey="target" fill="#10b981" name="Target" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6 min-h-[350px]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>Weekly Performance</h2>
                            <button onClick={() => setFullscreenType('Line')} className='p-1 hover:bg-gray-100 rounded text-xs text-gray-500'>⛶ Fullscreen</button>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" /><YAxis />
                                <Tooltip /><Legend />
                                <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6 min-h-[350px]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>Distribution by Category</h2>
                            <button onClick={() => setFullscreenType('Pie')} className='p-1 hover:bg-gray-100 rounded text-xs text-gray-500'>⛶ Fullscreen</button>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" labelLine={true}
                                    label={({ name, percent }) => `${name ?? 'Unknown'}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={100} dataKey='value'>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}