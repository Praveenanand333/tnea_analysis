// App.js
import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import ResultsTable from './components/ResultsTable';
import { communityList, courseGroups, getRankLowerBound, getCutoffLowerBound } from './utils/helpers';
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

  useEffect(() => {
    fetch('/unique_courses.json')
      .then(res => res.json())
      .then(setCourseMap);
  }, []);

  const fetchData = async () => {
    if (!value || !community) return;
    const filesToFetch = [
      'rank_2023.json', 'rank_2024.json',
      'cutoff_2023.json', 'cutoff_2024.json'
    ];

    const dataFiles = await Promise.all(
      filesToFetch.map(file => fetch(`/${file}`).then(res => res.json()))
    );

    const filtered = [];
    const lowerBound = mode === 'rank' ? getRankLowerBound(value, certainty) : getCutoffLowerBound(value, certainty);

    dataFiles.forEach((data, idx) => {
      const isRank = filesToFetch[idx].toLowerCase().includes('rank');
      if ((mode === 'rank' && isRank) || (mode === 'cutoff' && !isRank)) {
        data.forEach(row => {
          const key = community;
          const val = row[key];
          if (!val) return;

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
  };

  return (
    <div className="app-container">
      <h1 className="app-title">TNEA Search</h1>

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

      <ResultsTable results={results} community={community} />
    </div>
  );
}

export default App;