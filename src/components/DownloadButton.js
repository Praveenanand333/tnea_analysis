import React, { useState } from 'react';
import './DownloadButton.css';
function DownloadButton({ results, community }) {
  const [count, setCount] = useState(100);

  const handleDownload = () => {
    let number = parseInt(count);
    if (isNaN(number) || number < 10 || number > 500) {
      alert('Please enter a number between 10 and 500');
      return;
    }

    const rows = results.slice(0, number);

    if (rows.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = ['College Code', 'College Name', 'Course ID', 'Course Name', 'Community', 'Value', 'Year', 'Type'];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => {
        const value = row[community] ?? '';
        return [
          row.coc,
          row.con,
          row.brc,
          row.brn,
          community,
          value,
          row.year,
          row.type
        ].map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.setAttribute('download', 'tnea_results.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="download-section">
      <label>Download top (10–500): </label>
      <input
        type="number"
        value={count}
        onChange={e => setCount(e.target.value)}
        min={10}
        max={500}
      />
      <button onClick={handleDownload}>Download CSV</button>
    </div>
  );
}

export default DownloadButton;
