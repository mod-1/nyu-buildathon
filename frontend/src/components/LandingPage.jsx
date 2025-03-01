import React from 'react'

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <h1 className="animated-title">Where do we wanna go today?</h1>
      <button
        className="start-button"
        onClick={onStart}
      >
        Start
      </button>
    </div>
  )
}

export default LandingPage