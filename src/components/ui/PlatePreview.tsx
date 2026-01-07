import React from 'react';

export function PlatePreview({ plate }: { plate: string }) {
  const cleanPlate = plate.replace(/[^A-Z0-9]/g, "");
  const p = cleanPlate.padEnd(7, " ").toUpperCase();
  
  // Validação Mercosul: 3 letras, 1 número, 1 letra, 2 números
  const isMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlate);
  // Validação Antiga: 3 letras, 4 números
  const isOldPattern = /^[A-Z]{3}[0-9]{4}$/.test(cleanPlate);
  
  const isValid = isMercosul || isOldPattern;
  const isComplete = cleanPlate.length === 7;

  const renderChar = (char: string, index: number) => {
    // Na Mercosul, as letras/números nas posições 3, 5 e 6 são azuis
    const isBlue = isMercosul && [3, 5, 6].includes(index);
    return (
      <span 
        key={index} 
        className={`text-3xl font-bold font-mono transition-colors duration-300 ${isBlue ? 'text-[#003399]' : 'text-black'}`}
      >
        {char}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-start mb-6 select-none">
      <div 
        className={`w-56 h-20 bg-white border-[3px] rounded-lg overflow-hidden flex flex-col shadow-xl transition-all duration-300 
          ${!isValid && isComplete ? 'border-red-500 animate-plate-shake' : 'border-gray-900'}
        `}
      >
        {/* Faixa Azul */}
        <div className={`h-5 flex items-center justify-between px-2 transition-colors duration-300 ${!isValid && isComplete ? 'bg-red-600' : 'bg-[#003399]'}`}>
          <div className="flex gap-0.5 items-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             <div className="flex flex-col gap-0.5 -mt-1">
               <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
               <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
             </div>
          </div>
          <span className="text-[9px] font-bold text-white tracking-[0.2em]">BRASIL</span>
          <div className="w-3.5 h-2.5 bg-[#009b3a] rounded-sm flex items-center justify-center overflow-hidden border border-white/20">
            <div className="w-2 h-1.5 bg-[#fedf00] rotate-45 flex items-center justify-center">
              <div className="w-1 h-1 bg-[#002776] rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Corpo da Placa */}
        <div className="flex-1 flex items-center px-2 bg-white relative">
          
          {/* Lado Esquerdo: QR Code + Selo BR */}
          <div className="flex flex-col items-center gap-1">
            {/* QR Code */}
            <div className="grid grid-cols-2 gap-0.5 opacity-80 mb-1">
              <div className="w-1.5 h-1.5 bg-black"></div>
              <div className="w-1.5 h-1.5 bg-black"></div>
              <div className="w-1.5 h-1.5 bg-black"></div>
              <div className="w-1 h-1 bg-black self-center justify-self-center"></div>
            </div>
            {/* Selo BR posicionado abaixo do QR Code */}
            <div className="flex flex-col items-center justify-center opacity-90 border-[1px] border-gray-300 rounded-sm px-0.5 h-4">
              <span className="text-[9px] font-black leading-none text-gray-400">BR</span>
            </div>
          </div>

          {/* Caracteres */}
          <div className="flex-1 flex justify-center gap-1">
            {p.split("").map((char, i) => renderChar(char, i))}
          </div>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {isComplete && !isValid && (
        <span className="text-[10px] text-red-500 mt-2 font-bold uppercase animate-pulse">
          Padrão de placa inválido
        </span>
      )}
    </div>
  );
}