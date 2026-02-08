import React from "react";

export const SecurityGauge = () => {
    return (
        <div className="security-gauge">
            <div className="security-gauge__circle">
                <svg viewBox="0 0 100 50" className="security-gauge__svg">
                    <path
                        d="M 10 50 A 40 40 0 1 1 90 50"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 10 50 A 40 40 0 1 1 90 50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="126"
                        strokeDashoffset="20"
                        className="security-gauge__fill"
                    />
                </svg>
                <div className="security-gauge__content">
                    <span className="security-gauge__percent">98%</span>
                    <span className="security-gauge__label">Security Strength</span>
                </div>
            </div>
            <div className="security-gauge__status">
                <div className="security-gauge__indicator"></div>
                <span>Verified</span>
            </div>
        </div>
    );
};
