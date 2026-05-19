import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Estima la fuerza de una contraseña (sin librerías externas).
 * Devuelve { score: 0–4, label, color, hint }.
 *  - 0/1: muy débil / débil
 *  - 2:   media
 *  - 3:   fuerte
 *  - 4:   muy fuerte
 */
export function estimatePasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '', hint: '' };

  let score = 0;
  if (password.length >= 8)  score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password))   score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Cap a 4
  score = Math.min(score, 4);

  const levels = [
    { label: 'Muy débil',  color: 'bg-red-400',    hint: 'Mínimo 8 caracteres.' },
    { label: 'Débil',      color: 'bg-orange-400', hint: 'Agrega mayúsculas, números y símbolos.' },
    { label: 'Media',      color: 'bg-yellow-400', hint: 'Buena, pero puede ser más fuerte.' },
    { label: 'Fuerte',     color: 'bg-green-400',  hint: '¡Muy bien!' },
    { label: 'Muy fuerte', color: 'bg-green-600',  hint: '¡Excelente!' },
  ];
  return { score, ...levels[score] };
}

/**
 * Input de contraseña con toggle "mostrar/ocultar" y barra opcional de fuerza.
 * Compatible con react-hook-form via forwardRef (register).
 *
 * Props especiales:
 *  - showStrength: bool — muestra la barra y label de fuerza
 *  - value:        string — solo necesario si querés calcular fuerza fuera de RHF
 *                  (RHF llama internamente al ref con el valor)
 *  - error:        bool — agrega borde rojo (opcional)
 */
const PasswordInput = forwardRef(function PasswordInput(
  { showStrength = false, error = false, className = '', onChange, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState(props.defaultValue ?? '');

  const handleChange = (e) => {
    setVal(e.target.value);
    onChange?.(e);
  };

  const strength = showStrength ? estimatePasswordStrength(val) : null;
  const baseClass =
    'w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f] focus:border-transparent';
  const borderClass = error ? 'border-red-500' : 'border-gray-200';

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={visible ? 'text' : 'password'}
          onChange={handleChange}
          className={`${baseClass} ${borderClass} ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          {visible ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && val && (
        <div className="mt-1.5">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${i <= strength.score ? strength.color : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium text-gray-700">{strength.label}</span>
            <span> · {strength.hint}</span>
          </p>
        </div>
      )}
    </div>
  );
});

export default PasswordInput;
