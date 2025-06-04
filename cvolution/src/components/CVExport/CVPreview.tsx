
import React from 'react';

interface CVPreviewProps {
  template: 'classic' | 'modern' | 'minimal';
  data: any;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ template, data }) => {
  const templateStyles = {
    classic: 'border border-gray-300 bg-white',
    modern: 'border border-blue-200 bg-gradient-to-br from-blue-50 to-white',
    minimal: 'border border-gray-200 bg-gray-50'
  };

  return (
    <div className={`p-6 rounded-lg ${templateStyles[template]} min-h-[400px]`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {data?.profile?.full_name || 'Ihr Name'}
          </h2>
          <p className="text-gray-600">
            {data?.profile?.headline || 'Ihre Berufsbezeichnung'}
          </p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Kontaktdaten</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{data?.profile?.location || 'Ihr Standort'}</p>
            <p>{data?.profile?.phone || 'Ihre Telefonnummer'}</p>
            <p>{data?.profile?.email || 'ihre.email@beispiel.com'}</p>
          </div>
        </div>

        {(data?.experiences?.length > 0 || !data) && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Berufliche Erfahrung</h3>
            <div className="text-sm text-gray-600">
              {data?.experiences?.slice(0, 2).map((exp: any, index: number) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{exp.job_title}</p>
                  <p className="text-gray-500">{exp.company}</p>
                </div>
              )) || (
                <div className="mb-2">
                  <p className="font-medium">Beispiel Position</p>
                  <p className="text-gray-500">Beispiel Unternehmen</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Fähigkeiten</h3>
          <div className="text-sm text-gray-600">
            {data?.skills?.slice(0, 4).map((skill: any, index: number) => (
              <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1">
                {skill.skill_name}
              </span>
            )) || (
              <>
                <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1">JavaScript</span>
                <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1">React</span>
                <span className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1">TypeScript</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
