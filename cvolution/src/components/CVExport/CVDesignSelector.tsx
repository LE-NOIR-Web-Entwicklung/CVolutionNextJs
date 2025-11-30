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
    <div className="flex gap-6 justify-center my-4">
      <CVDesignPreview
        label="Modern"
        imgSrc="/lovable-uploads/52816b4d-4592-4ac6-a2ca-7eba6c6d86d2.png"
        selected={selected === 'design1'}
        onClick={() => handleSelect('design1')}
      />
      <CVDesignPreview
        label="Minimal"
        imgSrc="/lovable-uploads/f40ab6d8-a47e-4e91-b431-58002f60e221.png"
        selected={selected === 'design2'}
        onClick={() => handleSelect('design2')}
      />
      <CVDesignPreview
        label="Klassisch"
        imgSrc="/lovable-uploads/cdc6fbed-c846-4243-b7ea-4eb12246f389.png"
        selected={selected === 'design3'}
        onClick={() => handleSelect('design3')}
      />
    </div>
  );
};
// ...existing code...

const CVDesignPreview: React.FC<{ label: string; imgSrc: string; selected: boolean; onClick: () => void }> = ({ label, imgSrc, selected, onClick }) => (
  <div
    className={`cursor-pointer border-4 rounded-2xl p-4 flex flex-col items-center transition-all duration-200 ${selected ? 'border-[#204878] bg-blue-100 shadow-2xl' : 'border-gray-200 bg-white'}`}
    onClick={onClick}
    style={{ width: 200 }}
  >
    <img src={imgSrc} alt={label} className="w-40 h-56 object-cover rounded-xl mb-4" />
    <span className={`text-base font-semibold ${selected ? 'text-[#204878]' : 'text-gray-600'}`}>{label}</span>
  </div>
);
