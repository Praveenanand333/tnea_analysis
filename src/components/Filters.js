import React from 'react';
import { communityList, courseGroups } from '../utils/helpers';
import './Filters.css';

function Filters({
  mode, setMode,
  value, setValue,
  community, setCommunity,
  courseId, setCourseId,
  courseName, setCourseName,
  courseGroup, setCourseGroup,
  certainty, setCertainty,
  courseMap,
  fetchData
}) {
  return (
    <div className="filters-container">
      <div>
        <label>Mode</label>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="rank">Search by Rank</option>
          <option value="cutoff">Search by Cutoff</option>
        </select>
      </div>

      <div>
        <label>Value ({mode === 'rank' ? 'General Rank' : 'Cutoff'})</label>
        <input
          type="number"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Community</label>
        <select value={community} onChange={e => setCommunity(e.target.value)}>
          {communityList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label>Certainty</label>
        <select value={certainty} onChange={e => setCertainty(e.target.value)}>
          <option value="confirm">Confirm</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>

      <div>
        <label>Course ID</label>
        <select value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">Any</option>
          {Object.keys(courseMap).sort().map(cid => (
            <option key={cid} value={cid}>{cid}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Course Name</label>
        <select value={courseName} onChange={e => setCourseName(e.target.value)}>
          <option value="">Any</option>
          {Object.entries(courseMap).sort((a, b) => a[1].localeCompare(b[1])).map(([cid, name]) => (
            <option key={cid} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Course Group</label>
        <select value={courseGroup} onChange={e => setCourseGroup(e.target.value)}>
          {Object.keys(courseGroups).map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div>
        <button className="search-button" onClick={fetchData}>Search</button>
      </div>
    </div>
  );
}

export default Filters;
