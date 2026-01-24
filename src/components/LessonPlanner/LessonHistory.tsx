import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { SavedLesson } from './useLessonHistory';
import { LessonPlan } from './types';
import {
  HistoryContainer,
  HistoryHeader,
  HistoryTitle,
  ClearButton,
  HistoryList,
  HistoryItem,
  HistoryItemHeader,
  HistoryItemTitle,
  HistoryItemDate,
  HistoryItemMeta,
  HistoryItemBadge,
  DeleteButton,
  EmptyHistory,
} from './historyStyles';

interface LessonHistoryProps {
  history: SavedLesson[];
  onSelect: (lessonPlan: LessonPlan) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const LessonHistory: React.FC<LessonHistoryProps> = ({
  history,
  onSelect,
  onDelete,
  onClear,
}) => {
  if (history.length === 0) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <HistoryTitle>
            <History size={18} />
            Histórico
          </HistoryTitle>
        </HistoryHeader>
        <EmptyHistory>
          Nenhum plano de aula salvo ainda
        </EmptyHistory>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>
          <History size={18} />
          Histórico ({history.length})
        </HistoryTitle>
        <ClearButton onClick={onClear}>
          <Trash2 size={12} style={{ marginRight: '0.25rem' }} />
          Limpar
        </ClearButton>
      </HistoryHeader>

      <HistoryList>
        {history.map((saved) => (
          <HistoryItem
            key={saved.id}
            onClick={() => onSelect(saved.lessonPlan)}
          >
            <HistoryItemHeader>
              <HistoryItemTitle>
                {saved.lessonPlan.subject || 'Plano de Aula'}
              </HistoryItemTitle>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HistoryItemDate>{formatDate(saved.createdAt)}</HistoryItemDate>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(saved.id);
                  }}
                >
                  <Trash2 size={14} />
                </DeleteButton>
              </div>
            </HistoryItemHeader>
            <HistoryItemMeta>
              <HistoryItemBadge>
                <Clock size={10} style={{ marginRight: '0.25rem' }} />
                {saved.lessonPlan.totalDuration} min
              </HistoryItemBadge>
              <span>{saved.lessonPlan.sections.length} seções</span>
            </HistoryItemMeta>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
};

export default LessonHistory;
