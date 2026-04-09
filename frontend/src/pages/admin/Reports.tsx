import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Download, Filter } from 'lucide-react';
import jsPDF from 'jspdf';

const Reports: React.FC = () => {
  const initialData = {
    revenue: 0,
    growth: 0,
    topSpecialization: 'N/A',
    avgWaitTime: 'N/A',
    monthlyData: [],
  };

  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await API.get('/admin/reports/summary');
      setData(response.data || initialData);
    } catch (error) {
      toast.error('Failed to fetch report data. Showing fallback data.');
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    try {
      setExporting(true);

      const doc = new jsPDF();
      const generatedOn = new Date().toLocaleString();
      let y = 20;

      doc.setFontSize(18);
      doc.text('MediSlot - Reports & Analytics', 14, y);
      y += 10;

      doc.setFontSize(10);
      doc.text(`Generated on: ${generatedOn}`, 14, y);
      y += 10;

      doc.setFontSize(13);
      doc.text('Summary', 14, y);
      y += 8;

      doc.setFontSize(11);
      const summaryLines = [
        `Total Revenue: $${Number(data.revenue || 0).toLocaleString()}`,
        `Growth: ${data.growth || 0}%`,
        `Top Specialization: ${data.topSpecialization || 'N/A'}`,
        `Avg. Wait Time: ${data.avgWaitTime || 'N/A'}`,
      ];
      summaryLines.forEach((line) => {
        doc.text(line, 18, y);
        y += 7;
      });

      y += 4;
      doc.setFontSize(13);
      doc.text('Monthly Appointments Trend', 14, y);
      y += 8;
      doc.setFontSize(11);

      if (Array.isArray(data.monthlyData) && data.monthlyData.length > 0) {
        data.monthlyData.forEach((item: any, index: number) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
            doc.setFontSize(13);
            doc.text('Monthly Appointments Trend (continued)', 14, y);
            y += 8;
            doc.setFontSize(11);
          }
          doc.text(`${index + 1}. ${item.month}: ${item.appointments} appointments`, 18, y);
          y += 7;
        });
      } else {
        doc.text('No monthly data available.', 18, y);
      }

      doc.save(`medislot-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1 text-dark">Reports & Analytics</h2>
          <p className="text-muted small mb-0 fw-medium">Monitor hospital performance and patient trends.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-white border-light shadow-sm rounded-pill px-4 py-2 d-flex align-items-center gap-2 hover:bg-light transition-all">
            <Filter size={18} className="text-primary" /> <span className="fw-bold small">Filter</span>
          </button>
          <button
            className="btn btn-primary shadow-lg rounded-pill px-4 py-2 d-flex align-items-center gap-2 hover:scale-105 transition-all"
            onClick={handleExportPdf}
            disabled={exporting}
          >
            <Download size={18} /> <span className="fw-bold small">{exporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {[
          { label: 'TOTAL REVENUE', value: `$${data.revenue.toLocaleString()}`, trend: `+${data.growth}% from last month`, icon: DollarSign, color: 'success' },
          { label: 'TOP SPECIALIZATION', value: data.topSpecialization, trend: 'Most booked department', icon: TrendingUp, color: 'primary' },
          { label: 'AVG. WAIT TIME', value: data.avgWaitTime, trend: 'Per appointment', icon: Calendar, color: 'warning' },
          { label: 'ACTIVE PATIENTS', value: '1,284', trend: '+5.2% this week', icon: Users, color: 'info' }
        ].map((stat, i) => (
          <div className="col-12 col-sm-6 col-xl-3" key={i}>
            <div className="card border-0 shadow-sm p-4 rounded-[32px] bg-white h-100 hover:shadow-md transition-all">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted fw-bold uppercase tracking-wider x-small">{stat.label}</span>
                <div className={`bg-${stat.color}-subtle p-2 rounded-xl text-${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 className="serif fw-bold mb-1 h3 text-dark">{stat.value}</h3>
              <span className={`text-${stat.color} small d-flex align-items-center gap-1 fw-medium x-small`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4 p-md-5 rounded-[32px] bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="serif fw-bold h4 text-dark mb-0">Monthly Appointments Trend</h5>
              <div className="bg-light px-3 py-1 rounded-pill text-muted x-small fw-bold">LAST 6 MONTHS</div>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={data.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#0d6efd" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAppts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 p-md-5 rounded-[32px] bg-white h-100">
            <h5 className="serif fw-bold h4 text-dark mb-4">Patient Demographics</h5>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { age: '0-18', count: 120 },
                  { age: '19-35', count: 450 },
                  { age: '36-60', count: 380 },
                  { age: '60+', count: 210 },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="age" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#0d6efd" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
