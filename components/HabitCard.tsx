import React from 'react';
import { Check, Flame, Clock, Pencil, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompletedToday, onToggle, onEdit, onDelete }) => {
  return (
    <div 
        className={`card mb-3 border-0 rounded-4 transition-all cursor-pointer position-relative overflow-hidden ${isCompletedToday ? 'bg-success-subtle' : 'bg-surface shadow-sm'}`}
        onClick={() => onToggle(habit.id)}
    >
      {/* Progress Bar Background for subtle effect */}
      {isCompletedToday && (
        <div className="position-absolute top-0 start-0 h-100 bg-success opacity-10" style={{ width: '100%' }}></div>
      )}
      
      <div className="card-body p-3 position-relative z-1">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {/* Icon */}
            <div className={`rounded-4 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm transition-all ${habit.color} ${isCompletedToday ? 'opacity-75' : ''}`} style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
               {habit.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Details */}
            <div>
              <div className="d-flex align-items-center">
                <h6 className={`mb-0 fw-bold me-2 ${isCompletedToday ? 'text-decoration-line-through text-muted' : 'text-body'}`}>
                  {habit.name}
                </h6>
                
                <div className="d-flex gap-1">
                   {/* Aesthetic Edit Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                      className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 transition-all text-secondary bg-body-tertiary hover-scale"
                      style={{ width: '26px', height: '26px' }}
                      title="Edit Habit"
                    >
                      <Pencil size={12} strokeWidth={2.5} />
                    </button>
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
                      className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 transition-all text-danger bg-danger-subtle hover-scale"
                      style={{ width: '26px', height: '26px' }}
                      title="Delete Habit"
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                </div>

              </div>
              <div className="d-flex align-items-center small gap-3 mt-1">
                <span className="d-flex align-items-center gap-1 bg-light rounded-pill px-2 py-0.5 text-secondary fw-medium">
                  <Clock size={11} /> {habit.reminderTime}
                </span>
                <span className={`d-flex align-items-center gap-1 fw-bold ${habit.streak > 0 ? 'text-orange' : 'text-secondary'}`}>
                  <Flame size={12} className={habit.streak > 0 ? 'fill-orange-500' : ''} style={{ color: habit.streak > 0 ? '#f97316' : 'inherit' }} /> {habit.streak}
                </span>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(habit.id); }}
            className={`btn rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm transition-all
              ${isCompletedToday 
                ? 'btn-success text-white scale-110' 
                : 'btn-light text-secondary bg-body-tertiary'
              }`}
            style={{ width: '44px', height: '44px', border: isCompletedToday ? 'none' : '2px solid transparent' }}
          >
            <Check size={22} strokeWidth={3.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;