import React from 'react';
import { Language } from '@/types';
import { languageService } from '@/services/languageService';
import './About.scss';

interface AboutProps {
  contextValue: {
    language: Language;
  };
}

const About: React.FC<AboutProps> = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>{languageService.getText('ABOUT')}</h1>
          <p>
            {languageService.getText('ABOUT_US_DESCRIPTION')}
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>
              {languageService.getText('ABOUT_US')}
            </h2>
            <p>
              {languageService.getText('ABOUT_US_DESCRIPTION')}
            </p>
          </div>

          <div className="about-section">
            <h2>
              {languageService.getText('OUR_MISSION')}
            </h2>
            <p>
              {languageService.getText('OUR_MISSION_DESCRIPTION')}
            </p>
          </div>

          <div className="about-section">
            <h2>
              {languageService.getText('CORE_VALUES')}
            </h2>
            <ul>
              <li>
                {languageService.getText('PROFESSIONALISM')}
              </li>
              <li>
                {languageService.getText('PRACTICALITY')}
              </li>
              <li>
                {languageService.getText('INNOVATION')}
              </li>
              <li>
                {languageService.getText('COMMUNITY')}
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h2>
              {languageService.getText('CONTENT_TOPICS')}
            </h2>
            <p>
              {languageService.getText('CONTENT_TOPICS_DESCRIPTION')}
            </p>
            <ul>
              <li>
                {languageService.getText('AGILE_PROJECT_MANAGEMENT')}
              </li>
              <li>
                {languageService.getText('TRADITIONAL_PROJECT_MANAGEMENT')}
              </li>
              <li>
                {languageService.getText('TEAM_COLLABORATION')}
              </li>
              <li>
                {languageService.getText('RISK_MANAGEMENT')}
              </li>
              <li>
                {languageService.getText('QUALITY_MANAGEMENT')}
              </li>
              <li>
                {languageService.getText('PROJECT_MANAGEMENT_TOOLS')}
              </li>
              <li>
                {languageService.getText('DIGITAL_TRANSFORMATION')}
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h2>
              {languageService.getText('CONTACT_US')}
            </h2>
            <p>
              {languageService.getText('CONTACT_US_DESCRIPTION')}
            </p>
            <ul>
              <li>
                {languageService.getText('EMAIL')}
              </li>
              <li>
                {languageService.getText('WECHAT_OFFICIAL_ACCOUNT')}
              </li>
              <li>
                {languageService.getText('LINKEDIN')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 