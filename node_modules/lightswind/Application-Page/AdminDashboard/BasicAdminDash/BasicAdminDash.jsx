import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, ChartDataLabels);

const BasicAdminDash = () => {
    const [darkMode, setDarkMode] = useState(false);

    // Sales Chart Data
    const salesData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56],
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            },
        ],
    };

    // Traffic Chart Data
    const trafficData = {
        labels: ['Page Views', 'Unique Visitors', 'Conversions'],
        datasets: [
            {
                label: 'Traffic',
                data: [3500, 2300, 1200],
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
        ],
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'dark-mode' : 'light-mode'}`} id="dashboard-body">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-5">
                <div className="text-lg font-bold mb-5">Admin Dashboard</div>
                <ul className="space-y-4">
                    <li><a href="#" className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-tachometer-alt mr-3"></i> Dashboard</a></li>
                    <li><a href="#analytics" className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-chart-line mr-3"></i> Analytics</a></li>
                    <li><a href="#tasks" className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-tasks mr-3"></i> Tasks</a></li>
                    <li><a href="#users" className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-users mr-3"></i> Users</a></li>
                    <li><a href="#settings" className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-cogs mr-3"></i> Settings</a></li>
                    <li><button onClick={toggleDarkMode} className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"><i className="fas fa-moon mr-3"></i> Toggle Dark Mode</button></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-5 overflow-auto">
                {/* Dashboard Overview Section */}
                <section id="dashboard" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-5">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Total Users</h3>
                            <p className="text-3xl">2,350</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Total Sales</h3>
                            <p className="text-3xl">$18,745</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">Pending Orders</h3>
                            <p className="text-3xl">120</p>
                        </div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section id="analytics" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-5">Analytics</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-md">
                            <Line data={salesData} options={{ plugins: { datalabels: { display: true, color: 'black' } }, scales: { y: { beginAtZero: true } } }} />
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md">
                            <Bar data={trafficData} options={{ plugins: { datalabels: { display: true, color: 'black' } }, scales: { y: { beginAtZero: true } } }} />
                        </div>
                    </div>
                </section>

                {/* Tasks Section */}
                <section id="tasks" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-5">Tasks</h2>
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3">Task List</h3>
                        <div className="scrollable space-y-3">
                            <div className="flex items-center justify-between">
                                <span>Design New Logo</span>
                                <button className="bg-blue-500 text-white px-3 py-1 rounded">In Progress</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Implement New Feature</span>
                                <button className="bg-green-500 text-white px-3 py-1 rounded">Completed</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Update Analytics Dashboard</span>
                                <button className="bg-red-500 text-white px-3 py-1 rounded">Pending</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* User Management Section */}
                <section id="users" className="mb-8">
                    <h2 className="text-2xl font-semibold mb-5">User Management</h2>
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 px-4">John Doe</td>
                                    <td className="py-2 px-4">johndoe@example.com</td>
                                    <td className="py-2 px-4"><span className="bg-green-500 text-white py-1 px-3 rounded">Active</span></td>
                                    <td className="py-2 px-4"><button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4">Jane Smith</td>
                                    <td className="py-2 px-4">janesmith@example.com</td>
                                    <td className="py-2 px-4"><span className="bg-red-500 text-white py-1 px-3 rounded">Inactive</span></td>
                                    <td className="py-2 px-4"><button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Settings Section */}
                <section id="settings">
                    <h2 className="text-2xl font-semibold mb-5">Settings</h2>
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold">Notifications</h3>
                        <p className="mb-4">Enable or disable notifications for tasks, messages, etc.</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded">Save Settings</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BasicAdminDash;
