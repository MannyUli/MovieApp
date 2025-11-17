import React from 'react';

/**
 * Heading component for rendering section headings.
 * Accepts a heading prop and renders it within a Bootstrap column.
 * This makes it reusable throughout the application.
 * @param {Object} props - Component props
 * @param {string} props.heading - The heading text to display
 */
const Heading = ({ heading }) => {
    return (
        <div className="col">
      <h3>{heading}</h3>
        </div>
    );
};

export default Heading;
