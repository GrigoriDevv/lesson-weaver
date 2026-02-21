import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #cfcfcf 0%,
    rgb(231, 231, 231) 50%,
    rgb(221, 221, 221) 100%
  );
  padding: 2rem;
  color: #e8e8e8;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #344266 0%, #3758a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #000000;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const PanelTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #e8e8e8;
  font-size: 1rem;
  resize: vertical;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #ebebeb;
    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #e8e8e8;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${({ $variant = "primary" }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, #ffffff 0%, #a1a1a1 100%);
    border: none;
    color: #3b3b3b;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(70, 70, 70, 0.3);
    }
  `
      : `
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e8e8e8;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(15, 23, 42, 0.3);
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LessonPlanContainer = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

export const LessonCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition:
    transform 0.2s,
    border-color 0.2s;

  &:hover {
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const LessonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

export const LessonTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f1f1;
`;

export const TimeBadge = styled.span`
  background: linear-gradient(135deg, #ffffff 0%, #575757 100%);
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
`;

export const LessonContent = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export const TotalTime = styled.div`
  background: rgb(59, 59, 59);
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  margin-top: 1rem;

  span {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffffd0 0%, #aaaaaa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #e9e9e9;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

export const ApiKeyInput = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const ApiKeyLabel = styled.p`
  color: #fbbf24;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f87171;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const SkeletonLoader = styled.div`
  animation: ${pulse} 1.5s ease-in-out infinite;

  & > div {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 1rem;
    height: 80px;
  }
`;

export const Select = styled.select`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #e8e8e8;
  font-size: 1rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #acacac;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  option {
    background: #1a1a2e;
    color: #e8e8e8;
  }
`;

export const ExportButton = styled.button`
  background: transparent;
  border: 1px solid rgba(218, 218, 218, 0.5);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionButton = styled.button<{ $variant?: "save" | "pdf" | "slides" }>`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case "save":
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
        `;
      case "pdf":
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          }
        `;
      case "slides":
        return `
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e8e8e8;

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const PDFUploadSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const PDFUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

export const PDFUploadArea = styled.div<{ $hasFile?: boolean }>`
  position: relative;
  border: 2px dashed ${({ $hasFile }) => ($hasFile ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.15)')};
  border-radius: 12px;
  background: ${({ $hasFile }) => ($hasFile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.2)')};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: ${({ $hasFile }) => ($hasFile ? 'rgba(16, 185, 129, 0.7)' : 'rgba(139, 92, 246, 0.5)')};
    background: ${({ $hasFile }) => ($hasFile ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.1)')};
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    gap: 0.5rem;
    cursor: pointer;
    color: ${({ $hasFile }) => ($hasFile ? '#10b981' : '#94a3b8')};
    text-align: center;
    pointer-events: none;

    span {
      font-size: 0.95rem;
      font-weight: 500;
    }

    small {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    svg {
      opacity: 0.8;
    }
  }
`;

export const GammaDownloadSection = styled.div`
  margin-top: 1.5rem;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const GammaDownloadTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #c4b5fd;
  margin-bottom: 0.75rem;
`;

export const GammaDownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e8e8e8;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateX(4px);
  }

  svg:last-child {
    margin-left: auto;
    opacity: 0.5;
  }
`;

export const PDFClearButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }
`;
