import React from 'react';
import { Language } from '@/types';
import { languageService } from '@/services/languageService';
import './About.scss';

interface AboutProps {
  contextValue: {
    language: Language;
  };
}

const About: React.FC<AboutProps> = ({ contextValue }) => {
  const { language } = contextValue;

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>{languageService.getText('ABOUT')}</h1>
          <p>
            {language === 'zh-CN'
              ? '了解PM Eyes博客的使命和愿景'
              : 'Learn about the mission and vision of PM Eyes blog'
            }
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>
              {language === 'zh-CN' ? '关于我们' : 'About Us'}
            </h2>
            <p>
              {language === 'zh-CN'
                ? 'PM Eyes是一个专注于项目管理的专业博客平台。我们致力于分享项目管理的最佳实践、工具、方法和经验，帮助项目管理者提升技能，实现项目成功。'
                : 'PM Eyes is a professional blog platform focused on project management. We are committed to sharing best practices, tools, methods, and experiences in project management to help project managers improve their skills and achieve project success.'
              }
            </p>
          </div>

          <div className="about-section">
            <h2>
              {language === 'zh-CN' ? '我们的使命' : 'Our Mission'}
            </h2>
            <p>
              {language === 'zh-CN'
                ? '通过深入浅出的文章和实用的案例分析，为项目管理者提供有价值的知识和见解，推动项目管理行业的专业发展。'
                : 'Through accessible articles and practical case studies, we provide valuable knowledge and insights for project managers, promoting the professional development of the project management industry.'
              }
            </p>
          </div>

          <div className="about-section">
            <h2>
              {language === 'zh-CN' ? '核心价值' : 'Core Values'}
            </h2>
            <ul>
              <li>
                {language === 'zh-CN' ? '专业性：提供高质量、专业的内容' : 'Professionalism: Provide high-quality, professional content'}
              </li>
              <li>
                {language === 'zh-CN' ? '实用性：注重实际应用和可操作性' : 'Practicality: Focus on practical application and operability'}
              </li>
              <li>
                {language === 'zh-CN' ? '创新性：探索项目管理的新方法和趋势' : 'Innovation: Explore new methods and trends in project management'}
              </li>
              <li>
                {language === 'zh-CN' ? '社区性：建立项目管理者交流的平台' : 'Community: Build a platform for project managers to communicate'}
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h2>
              {language === 'zh-CN' ? '内容主题' : 'Content Topics'}
            </h2>
            <p>
              {language === 'zh-CN'
                ? '我们的文章涵盖以下主题：'
                : 'Our articles cover the following topics:'
              }
            </p>
            <ul>
              <li>
                {language === 'zh-CN' ? '敏捷项目管理' : 'Agile Project Management'}
              </li>
              <li>
                {language === 'zh-CN' ? '传统项目管理方法' : 'Traditional Project Management Methods'}
              </li>
              <li>
                {language === 'zh-CN' ? '团队协作与沟通' : 'Team Collaboration and Communication'}
              </li>
              <li>
                {language === 'zh-CN' ? '风险管理' : 'Risk Management'}
              </li>
              <li>
                {language === 'zh-CN' ? '质量管理' : 'Quality Management'}
              </li>
              <li>
                {language === 'zh-CN' ? '项目管理工具和技术' : 'Project Management Tools and Technologies'}
              </li>
              <li>
                {language === 'zh-CN' ? '数字化转型中的项目管理' : 'Project Management in Digital Transformation'}
              </li>
            </ul>
          </div>

          <div className="about-section">
            <h2>
              {language === 'zh-CN' ? '联系我们' : 'Contact Us'}
            </h2>
            <p>
              {language === 'zh-CN'
                ? '如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：'
                : 'If you have any questions, suggestions, or collaboration intentions, please feel free to contact us through the following ways:'
              }
            </p>
            <ul>
              <li>
                {language === 'zh-CN' ? '邮箱：hjm100@126.com' : 'Email: hjm100@126.com'}
              </li>
              <li>
                {language === 'zh-CN' ? '微信公众号：项界新探' : 'WeChat Official Account: PM Eyes'}
              </li>
              <li>
                {language === 'zh-CN' ? 'LinkedIn：PM Eyes Blog' : 'LinkedIn: PM Eyes Blog'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 