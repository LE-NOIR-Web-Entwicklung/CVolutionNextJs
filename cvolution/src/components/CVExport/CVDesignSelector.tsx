import React from 'react';

export type CVDesign = 'design1' | 'design2' | 'design3';

// ...existing code...
interface CVDesignSelectorProps {
  selected: CVDesign;
  onSelect: (design: CVDesign) => void;
}

const validDesigns: CVDesign[] = ['design1', 'design2', 'design3'];

export const CVDesignSelector: React.FC<CVDesignSelectorProps> = ({ selected, onSelect }) => {
  const handleSelect = (design: CVDesign) => {
    if (validDesigns.includes(design)) {
      onSelect(design);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-items-center my-2 sm:my-4 w-full">
      <CVDesignPreview
        label="Klassisch"
        imgSrc="/lovable-uploads/cdc6fbed-c846-4243-b7ea-4eb12246f389.png"
        selected={selected === 'design3'}
        onClick={() => handleSelect('design3')}
      />
      <CVDesignPreview
        label="Modern"
        imgSrc="/lovable-uploads/52816b4d-4592-4ac6-a2ca-7eba6c6d86d2.png"
        selected={selected === 'design1'}
        onClick={() => handleSelect('design1')}
        />
      <CVDesignPreview
        label="Zeitlos"
        imgSrc="/lovable-uploads/f40ab6d8-a47e-4e91-b431-58002f60e221.png"
        selected={selected === 'design2'}
        onClick={() => handleSelect('design2')}
        />
      </div>
  );
};
// ...existing code...

const CVDesignPreview: React.FC<{ label: string; imgSrc: string; selected: boolean; onClick: () => void }> = ({ label, imgSrc, selected, onClick }) => (
  <div
    className={`cursor-pointer border-2 sm:border-4 rounded-lg sm:rounded-2xl p-2 sm:p-3 lg:p-4 flex flex-col items-center transition-all duration-200 w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px] ${selected ? 'border-[#204878] bg-blue-100 shadow-2xl' : 'border-gray-200 bg-white'}`}
    onClick={onClick}
  >
    <img src={imgSrc} alt={label} className="w-full aspect-[4/5.6] object-cover rounded-lg sm:rounded-xl mb-2 sm:mb-3 lg:mb-4" />
    <span className={`text-sm sm:text-base font-semibold ${selected ? 'text-[#204878]' : 'text-gray-600'}`}>{label}</span>
  </div>
);
