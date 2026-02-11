import React from 'react';
import HeroSection from '../components/landing/HeroSection.jsx';
import FeatureSection from '../components/landing/FeatureSection.jsx';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection.jsx';
import TechStack from '../components/landing/TechStack.jsx';
import AboutSection from '../components/landing/AboutSection.jsx';
import AuthSection from '../components/landing/AuthSection.jsx';

// Feature data
const doctorFeatures = [
  '24/7 availability',
  'Natural language processing',
  'Multi-language support',
  'Voice & text input',
  'Emotional intelligence',
];

const reportFeatures = [
  'Supports 50+ formats (PDF, JPG, PNG, DICOM, CSV)',
  'Abnormality highlighting',
  'Trend analysis over time',
  'Plain English explanations',
  'Downloadable summaries',
];

const treatmentFeatures = [
  'Vaccination scheduling',
  'Medication reminders',
  'Progress tracking',
  'Family health profiles',
  'Pharmacy integration',
];

const medicationFeatures = [
  'Drug interaction checker',
  'Dosage tracking',
  'Refill reminders',
  'Side effect monitor',
  'Cost comparison',
];

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Dr. AI - Left Model, Right Content */}
      <FeatureSection
        sectionId="dr-ai"
        title="Dr. AI — Your Personal Physician"
        description="Describe symptoms in natural conversation. Our AI understands context, asks intelligent follow-ups, and provides accurate medical guidance instantly."
        features={doctorFeatures}
        modelType="doctor"
        modelPath="/models/medical doctor 3d model.glb"
        reversed={false}
      />

      {/* Section 3: Report Analyzer - Right Model, Left Content */}
      <FeatureSection
        sectionId="report-analyzer"
        title="Report Analyzer"
        description="Upload any medical report — blood tests, X-rays, MRIs, prescriptions. Our AI reads, interprets, and explains in plain language."
        features={reportFeatures}
        modelType="stethoscope"
        modelPath="/models/stethoscope 3d model.glb"
        reversed={true}
      />

      {/* Section 4: Treatment Tracker - Left Model, Right Content */}
      <FeatureSection
        sectionId="treatment-tracker"
        title="Treatment Tracker"
        description="From vaccines to medications, track every treatment. Smart reminders ensure you never miss a dose."
        features={treatmentFeatures}
        modelType="syringe"
        modelPath="/models/cartoon syringe 3d model.glb"
        reversed={false}
      />

      {/* Section 5: Medication Manager - Right Model, Left Content */}
      <FeatureSection
        sectionId="medication-manager"
        title="Medication Manager"
        description="Manage prescriptions with confidence. Drug interaction checker prevents dangerous combinations."
        features={medicationFeatures}
        modelType="pills"
        modelPath="/models/pill bottle 3d model.glb"
        reversed={true}
      />

      {/* Section 6: Dashboard Preview - Center Model */}
      <DashboardPreviewSection />

      {/* Section 7: Tech Stack */}
      <TechStack />

      {/* Section 8: About Us */}
      <AboutSection />

      {/* Section 9: Authentication */}
      <AuthSection />
    </div>
  );
};

export default LandingPage;
