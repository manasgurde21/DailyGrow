import React from 'react';
import { Circle, CheckCircle2, Pencil } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-danger-subtle text-danger';
    case 'Medium': return 'bg-warning-subtle text-warning-emphasis';
    case 'Low': return 'bg-primary-subtle text-primary';
    default: return 'bg-secondary-subtle text-secondary';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`card mb-3 border-0 shadow-sm rounded-4 transition-all ${task.completed ? 'bg-success-subtle' : 'bg-surface'}`}>
      <div className="card-body p-3">
        <div className="d-flex align-items-start gap-3">
          <button 
            onClick={() => onToggle(task.id)}
            className={`btn p-0 border-0 mt-1 transition-all ${task.completed ? 'text-success' : 'text-secondary opacity-50 hover-opacity-100'}`}
          >
            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <h6 className={`mb-1 fw-medium ${task.completed ? 'text-decoration-line-through text-body-secondary' : 'text-body'}`}>
                {task.title}
              </h6>
              <span className={`badge rounded-pill ${getPriorityBadgeClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className={`small mb-2 text-truncate ${task.completed ? 'text-body-secondary' : 'text-muted'}`} style={{ maxWidth: '90%' }}>{task.description}</p>
            )}
            <div className="d-flex justify-content-between align-items-center mt-1">
              <span className={`small ${task.completed ? 'text-body-secondary' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>{task.date}</span>
              <div className="d-flex gap-2">
                <button 
                  onClick={() => onEdit(task)}
                  className={`btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1 ${task.completed ? 'text-body-secondary' : 'text-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button 
                  onClick={() => onDelete(task.id)}
                  className={`btn btn-link btn-sm p-0 text-decoration-none ${task.completed ? 'text-danger opacity-75' : 'text-danger'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;