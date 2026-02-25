import styled from 'styled-components';

export const HistoryContainer = styled.div`
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid hsl(225, 15%, 20%);
`;

export const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
`;

export const HistoryTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: hsl(220, 20%, 80%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ClearButton = styled.button`
  background: transparent;
  border: 1px solid hsla(0, 60%, 50%, 0.3);
  color: hsl(0, 60%, 60%);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: hsla(0, 60%, 50%, 0.1);
    border-color: hsla(0, 60%, 50%, 0.5);
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 0.4rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(225, 15%, 25%);
    border-radius: 4px;
  }
`;

export const HistoryItem = styled.div`
  background: hsl(225, 18%, 11%);
  border: 1px solid hsl(225, 15%, 18%);
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: hsl(250, 40%, 40%);
    box-shadow: 0 2px 8px hsla(250, 40%, 30%, 0.12);
  }
`;

export const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.35rem;
`;

export const HistoryItemTitle = styled.h4`
  font-size: 0.88rem;
  font-weight: 600;
  color: hsl(220, 20%, 85%);
  margin: 0;
`;

export const HistoryItemDate = styled.span`
  font-size: 0.68rem;
  color: hsl(220, 10%, 42%);
`;

export const HistoryItemMeta = styled.div`
  display: flex;
  gap: 0.6rem;
  font-size: 0.72rem;
  color: hsl(220, 12%, 50%);
`;

export const HistoryItemBadge = styled.span`
  background: hsla(260, 50%, 50%, 0.15);
  color: hsl(260, 50%, 65%);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 500;
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: hsl(220, 10%, 40%);
  padding: 0.2rem;
  cursor: pointer;
  transition: color 0.2s;
  margin-left: 0.4rem;

  &:hover {
    color: hsl(0, 60%, 55%);
  }
`;

export const EmptyHistory = styled.div`
  text-align: center;
  padding: 1.5rem 1rem;
  color: hsl(220, 10%, 40%);
  font-size: 0.82rem;
`;
