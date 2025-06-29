import React, { useState } from 'react';
import './DownloadButton.css'

function DownloadButton({ results, community }) {
  const [limit, setLimit] = useState(100);
  const [error, setError] = useState('');

  const handleDownload = () => {
    const count = parseInt(limit);
    if (isNaN(count) || count < 10 || count > 500) {
      setError('Please enter a number between 10 and 500.');
      return;
    }

    const sliced = results.slice(0, count);

    const headers = [
      'Counselling Code',
      'College Name',
      'Course ID',
      'Course Name',
      'Community',
      modeHeader(results),
      'Year',
      'Type'
    ];

    const rows = sliced.map(row => {
      const val = row[community] ?? '';
      return [
        row.coc,
        row.con,
        row.brc,
        row.brn,
        community,
        val,
        row.year,
        row.type
      ].map(item => `"${(item ?? '').toString().replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TNEA_Results_${community}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modeHeader = (res) => {
    if (res.length === 0) return 'Value';
    return res[0].type === 'Rank' ? 'Rank' : 'Cutoff';
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label>
        How many top results to download (10 - 500):&nbsp;
        <input
          type="number"
          min={10}
          max={500}
          value={limit}
          onChange={e => {
            setLimit(e.target.value);
            setError('');
          }}
          style={{ padding: '4px', marginRight: '10px' }}
        />
      </label>
      <button onClick={handleDownload}>
        Download as CSV
      </button>
      {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
    </div>
  );
}

export default DownloadButton;
