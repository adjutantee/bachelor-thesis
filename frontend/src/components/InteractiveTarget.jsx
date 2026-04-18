import React, { useState, useRef, useCallback } from 'react';
import { FiRotateCcw } from 'react-icons/fi';

const InteractiveTarget = ({ 
  shots = [],
  onShotAdded,
  disabled = false,
  maxShots = null,
  className = '',
  seriesConfig = null // New prop for series configuration
}) => {
  const targetRef = useRef(null);

  // Series colors - vibrant and distinct colors with better contrast
  const seriesColors = [
    { bg: '#dc2626', text: 'white', name: 'Красная' },    // Red
    { bg: '#2563eb', text: 'white', name: 'Синяя' },     // Blue
    { bg: '#059669', text: 'white', name: 'Зеленая' },   // Green
    { bg: '#d97706', text: 'white', name: 'Оранжевая' }, // Orange
    { bg: '#7c3aed', text: 'white', name: 'Фиолетовая' }, // Purple
    { bg: '#db2777', text: 'white', name: 'Розовая' },   // Pink
    { bg: '#0891b2', text: 'white', name: 'Голубая' },   // Cyan
    { bg: '#65a30d', text: 'white', name: 'Лаймовая' },  // Lime
    { bg: '#ea580c', text: 'white', name: 'Янтарная' },  // Amber
    { bg: '#4f46e5', text: 'white', name: 'Индиго' },    // Indigo
  ];

  // Calculate score based on distance from center (ISSF 10-point scoring)
  const calculateScore = useCallback((x, y) => {
    const distance = Math.sqrt(x * x + y * y);
    
    // ISSF scoring rings (normalized to -1 to 1 coordinate system)
    if (distance <= 0.05) return 10.9; // X-ring (inner 10)
    if (distance <= 0.1) return 10.0;  // 10-ring
    if (distance <= 0.2) return 9.0;   // 9-ring
    if (distance <= 0.3) return 8.0;   // 8-ring
    if (distance <= 0.4) return 7.0;   // 7-ring
    if (distance <= 0.5) return 6.0;   // 6-ring
    if (distance <= 0.6) return 5.0;   // 5-ring
    if (distance <= 0.7) return 4.0;   // 4-ring
    if (distance <= 0.8) return 3.0;   // 3-ring
    if (distance <= 0.9) return 2.0;   // 2-ring
    if (distance <= 1.0) return 1.0;   // 1-ring
    return 0.0; // Miss
  }, []);

  const handleTargetClick = useCallback((e) => {
    if (!targetRef.current || disabled) return;
    if (maxShots && shots.length >= maxShots) return;

    const rect = targetRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Convert to normalized coordinates (-1 to 1)
    const x = ((e.clientX - rect.left) - centerX) / centerX;
    const y = (centerY - (e.clientY - rect.top)) / centerY;

    const score = calculateScore(x, y);
    const shotNumber = shots.length + 1;

    const newShot = {
      id: Date.now(),
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      score: Math.round(score * 10) / 10,
      shotNumber
    };

    console.log('InteractiveTarget: Shot recorded:', newShot);
    onShotAdded?.(newShot);
  }, [shots.length, disabled, maxShots, calculateScore, onShotAdded]);

  // Function to determine which series a shot belongs to
  const getShotSeries = (shotIndex) => {
    if (!seriesConfig || !seriesConfig.shotsPerSeries) {
      // If no series config, treat all shots as one series
      return 0;
    }
    return Math.floor(shotIndex / seriesConfig.shotsPerSeries);
  };

  // Function to get color for a shot based on its series
  const getShotColor = (shotIndex) => {
    if (!seriesConfig || !seriesConfig.shotsPerSeries) {
      return seriesColors[0]; // Default to first color if no series config
    }
    const seriesIndex = getShotSeries(shotIndex);
    return seriesColors[seriesIndex % seriesColors.length];
  };

  // Function to get shot number within its series
  const getShotNumberInSeries = (shotIndex) => {
    if (!seriesConfig || !seriesConfig.shotsPerSeries) {
      return shotIndex + 1;
    }
    return (shotIndex % seriesConfig.shotsPerSeries) + 1;
  };

  const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <div 
          ref={targetRef}
          onClick={handleTargetClick}
          className={`relative w-full aspect-square rounded-full bg-white border-2 border-gray-200 max-w-md mx-auto ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair hover:border-primary-300'
          }`}
          style={{ maxWidth: '400px' }}
        >
          {/* Scoring Rings */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-300"
              style={{
                width: `${100 - (i * 10)}%`,
                height: `${100 - (i * 10)}%`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: i === 0 ? '#f8f9fa' : 'transparent'
              }}
            >
              {/* Score Numbers */}
              {i < 3 && (
                <div
                  className="absolute text-xs font-medium text-gray-500"
                  style={{
                    left: '50%',
                    top: '10%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {10 - i}
                </div>
              )}
            </div>
          ))}

          {/* Center Point */}
          <div 
            className="absolute w-1 h-1 bg-gray-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Shot Markers - Small dots */}
          {shots.map((shot, index) => {
            const shotColor = getShotColor(index);
            const seriesNumber = getShotSeries(index) + 1;
            const shotInSeries = getShotNumberInSeries(index);
            
            return (
              <div
                key={shot.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((shot.x + 1) / 2) * 100}%`,
                  top: `${((1 - shot.y) / 2) * 100}%`
                }}
              >
                {/* Small shot dot with series color */}
                <div 
                  className="w-2 h-2 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: shotColor.bg }}
                  title={`Серия ${seriesNumber}, выстрел ${shotInSeries}: ${shot.score.toFixed(1)} очков`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Выстрелов: {shots.length}
          </p>
          {shots.length > 0 && (
            <div className="mt-2">
              <p className="text-lg font-semibold text-primary-600">
                Счет: {totalScore.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">
                Средний: {(totalScore / shots.length).toFixed(1)}
              </p>
            </div>
          )}
          
          {!disabled && (
            <div className="mt-3 text-xs text-gray-500">
              <p>Нажмите на мишень, чтобы записать выстрел</p>
              <p>Координаты и счет рассчитываются автоматически</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTarget;