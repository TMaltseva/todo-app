import React, { useCallback } from 'react';
import { FilterType } from '@/types';
import styles from './TodoFilters.module.css';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
];

export const TodoFilters = React.memo<TodoFiltersProps>(
  ({ currentFilter, onFilterChange }) => {
    const handleFilterChange = useCallback(
      (filter: FilterType) => () => {
        onFilterChange(filter);
      },
      [onFilterChange]
    );

    return (
      <ul className={styles.filters}>
        {FILTERS.map(({ key, label }) => (
          <li key={key} className={styles.filterItem}>
            <button
              className={`${styles.filterLink} ${
                currentFilter === key ? styles.selected : ''
              }`}
              onClick={handleFilterChange(key)}
              aria-current={currentFilter === key ? 'page' : undefined}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    );
  }
);
