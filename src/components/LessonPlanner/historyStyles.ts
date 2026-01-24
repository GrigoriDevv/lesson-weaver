import styled from 'styled-components';

export const HistoryContainer = styled.div`
  margin-top: 2rem;
`;

export const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const HistoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ClearButton = styled.button`
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #f87171;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

export const HistoryItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(0, 217, 255, 0.3);
    transform: translateX(4px);
  }
`;

export const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const HistoryItemTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
`;

export const HistoryItemDate = styled.span`
  font-size: 0.7rem;
  color: #64748b;
`;

export const HistoryItemMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #94a3b8;
`;

export const HistoryItemBadge = styled.span`
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  padding: 0.25rem;
  cursor: pointer;
  transition: color 0.2s;
  margin-left: 0.5rem;

  &:hover {
    color: #f87171;
  }
`;

export const EmptyHistory = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;
