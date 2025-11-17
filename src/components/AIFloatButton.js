import React from 'react';
import { Link } from 'react-router-dom';
import './AIFloatButton.css';

const AIFloatButton = () => {
  return (
    <Link to="/discover" className="ai-float">
      <div className="ai-float__circle">?</div>
      <span className="ai-float__label">Reco</span>
    </Link>
  );
};

export default AIFloatButton;
