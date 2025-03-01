import React from 'react'

const DateDurationInput = ({ startDate, setStartDate, tripDuration, setTripDuration }) => {
  return (
    <div className="form-group double-input">
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>Trip Duration (days)</label>
        <input
          type="number"
          min="1"
          placeholder="7"
          value={tripDuration}
          onChange={(e) => setTripDuration(e.target.value)}
        />
      </div>
    </div>
  )
}

export default DateDurationInput