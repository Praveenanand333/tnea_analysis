import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import ResultsTable from './components/ResultsTable';
import { communityList, courseGroups, getRankLowerBound, getCutoffLowerBound } from './utils/helpers';
import DownloadButton from './components/DownloadButton';
import './App.css';

function App() {
  const [mode, setMode] = useState('rank');
  const [community, setCommunity] = useState('OC');
  const [value, setValue] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseGroup, setCourseGroup] = useState('ANY');
  const [certainty, setCertainty] = useState('confirm');
  const [courseMap, setCourseMap] = useState({});
  const [results, setResults] = useState([]);

  // Load course map from public/unique_courses.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/unique_courses.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setCourseMap)
      .catch(error => {
        console.error('Failed to load unique_courses.json:', error);
        alert('⚠️ Failed to load course data. Please make sure unique_courses.json is placed correctly in the public folder.');
      });
  }, []);

  const fetchData = async () => {
    if (!value || !community) return;

    const filesToFetch = [
      'Rank_2023.json', 'Rank_2024.json',
      'Cutoff_2023.json', 'Cutoff_2024.json'
    ];

    try {
      const dataFiles = await Promise.all(
        filesToFetch.map(file =>
          fetch(process.env.PUBLIC_URL + `/${file}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to load ${file}`);
              return res.json();
            })
        )
      );

      const filtered = [];
      const lowerBound = mode === 'rank'
        ? getRankLowerBound(value, certainty)
        : getCutoffLowerBound(value, certainty);

      dataFiles.forEach((data, idx) => {
        const isRank = filesToFetch[idx].toLowerCase().includes('rank');

        if ((mode === 'rank' && isRank) || (mode === 'cutoff' && !isRank)) {
          data.forEach(row => {
            const val = row[community];
            if (val === undefined || val === '') return;

            const matchValue = mode === 'rank' ? val >= lowerBound : val <= lowerBound;
            const matchId = courseId ? row.brc === courseId : true;
            const matchName = courseName ? row.brn === courseName : true;
            const matchGroup = courseGroup === 'ANY' || courseGroups[courseGroup].includes(row.brc);

            if (matchValue && matchId && matchName && matchGroup) {
              filtered.push({
                ...row,
                year: filesToFetch[idx].match(/\d{4}/)[0],
                type: isRank ? 'Rank' : 'Cutoff'
              });
            }
          });
        }
      });

      setResults(filtered);
    } catch (error) {
      console.error('Error loading data files:', error);
      alert('❌ Error loading rank/cutoff data. Please make sure all JSON files are in the public folder.');
    }
  };

  // Sort results before rendering or downloading
  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[community] ?? 0;
    const bVal = b[community] ?? 0;
    return mode === 'rank' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="app-container">
      <h1 className="app-title">TNEA College Search</h1>

      <Filters
        mode={mode} setMode={setMode}
        value={value} setValue={setValue}
        community={community} setCommunity={setCommunity}
        courseId={courseId} setCourseId={setCourseId}
        courseName={courseName} setCourseName={setCourseName}
        courseGroup={courseGroup} setCourseGroup={setCourseGroup}
        certainty={certainty} setCertainty={setCertainty}
        courseMap={courseMap}
        fetchData={fetchData}
      />

      <ResultsTable results={sortedResults} community={community} />

      {sortedResults.length > 0 && (
        <DownloadButton results={sortedResults} community={community} />
      )}
    </div>
  );
}

export default App;
