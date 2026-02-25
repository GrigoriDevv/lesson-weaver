import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
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
    opacity: 0.4;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    160deg,
    hsl(225, 25%, 8%) 0%,
    hsl(230, 20%, 12%) 40%,
    hsl(220, 18%, 10%) 100%
  );
  padding: 2rem 1.5rem;
  color: hsl(210, 20%, 90%);

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.6s ease-out;
  padding: 1.5rem 0;
`;

export const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, hsl(220, 70%, 65%) 0%, hsl(260, 80%, 72%) 50%, hsl(280, 60%, 65%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: hsl(220, 15%, 55%);
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.01em;
`;

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 2rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  background: hsl(225, 18%, 13%);
  border: 1px solid hsl(225, 15%, 20%);
  border-radius: 20px;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 24px hsla(225, 40%, 5%, 0.5);

  @media (max-width: 600px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

export const PanelTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
  color: hsl(220, 20%, 85%);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid hsl(225, 15%, 20%);

  svg {
    color: hsl(250, 60%, 65%);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  background: hsl(225, 20%, 10%);
  border: 1px solid hsl(225, 15%, 22%);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  color: hsl(210, 20%, 90%);
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: hsl(250, 50%, 55%);
    box-shadow: 0 0 0 3px hsla(250, 50%, 55%, 0.15);
  }

  &::placeholder {
    color: hsl(220, 10%, 40%);
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: hsl(220, 15%, 55%);
  margin-bottom: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const Input = styled.input`
  width: 100%;
  background: hsl(225, 20%, 10%);
  border: 1px solid hsl(225, 15%, 22%);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: hsl(210, 20%, 90%);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: hsl(250, 50%, 55%);
    box-shadow: 0 0 0 3px hsla(250, 50%, 55%, 0.15);
  }

  &::placeholder {
    color: hsl(220, 10%, 40%);
  }
`;

export const Select = styled.select`
  width: 100%;
  background: hsl(225, 20%, 10%);
  border: 1px solid hsl(225, 15%, 22%);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: hsl(210, 20%, 90%);
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: hsl(250, 50%, 55%);
    box-shadow: 0 0 0 3px hsla(250, 50%, 55%, 0.15);
  }

  option {
    background: hsl(225, 20%, 12%);
    color: hsl(210, 20%, 90%);
  }
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 100%;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${({ $variant = "primary" }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, hsl(250, 60%, 55%) 0%, hsl(280, 70%, 50%) 100%);
    border: none;
    color: white;
    box-shadow: 0 4px 16px hsla(260, 60%, 45%, 0.35);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px hsla(260, 60%, 45%, 0.45);
    }
  `
      : `
    background: transparent;
    border: 1px solid hsl(225, 15%, 25%);
    color: hsl(210, 20%, 80%);

    &:hover:not(:disabled) {
      background: hsla(250, 30%, 40%, 0.15);
      border-color: hsl(250, 40%, 45%);
    }
  `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid hsla(0, 0%, 100%, 0.25);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LessonPlanContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

export const LessonCard = styled.div`
  background: hsl(225, 18%, 11%);
  border: 1px solid hsl(225, 15%, 18%);
  border-radius: 14px;
  padding: 1.25rem 1.35rem;
  margin-bottom: 0.85rem;
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: hsl(250, 40%, 40%);
    box-shadow: 0 2px 12px hsla(250, 40%, 30%, 0.15);
  }
`;

export const LessonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
`;

export const LessonTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: hsl(220, 20%, 90%);
`;

export const TimeBadge = styled.span`
  background: linear-gradient(135deg, hsl(250, 60%, 55%), hsl(280, 50%, 50%));
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

export const LessonContent = styled.p`
  color: hsl(220, 12%, 55%);
  font-size: 0.9rem;
  line-height: 1.65;
`;

export const TotalTime = styled.div`
  background: linear-gradient(135deg, hsl(250, 40%, 20%), hsl(280, 30%, 18%));
  border: 1px solid hsl(260, 30%, 30%);
  border-radius: 14px;
  padding: 1.1rem;
  text-align: center;
  margin-top: 1rem;

  span {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, hsl(220, 60%, 75%) 0%, hsl(280, 60%, 75%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: hsl(220, 15%, 55%);
    font-size: 0.82rem;
    margin-top: 0.2rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

export const ApiKeyInput = styled.div`
  background: hsla(45, 90%, 50%, 0.08);
  border: 1px solid hsla(45, 90%, 50%, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const ApiKeyLabel = styled.p`
  color: hsl(45, 80%, 55%);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  color: hsl(220, 12%, 40%);

  svg {
    width: 56px;
    height: 56px;
    margin-bottom: 1.25rem;
    opacity: 0.35;
    color: hsl(250, 40%, 50%);
  }

  p {
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 280px;
    margin: 0 auto;
  }
`;

export const ErrorMessage = styled.div`
  background: hsla(0, 70%, 55%, 0.08);
  border: 1px solid hsla(0, 60%, 50%, 0.25);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: hsl(0, 70%, 65%);
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SkeletonLoader = styled.div`
  & > div {
    background: linear-gradient(
      90deg,
      hsl(225, 18%, 15%) 0%,
      hsl(225, 18%, 20%) 50%,
      hsl(225, 18%, 15%) 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s ease-in-out infinite;
    border-radius: 12px;
    margin-bottom: 0.85rem;
    height: 80px;
  }
`;

export const ExportButton = styled.button`
  background: transparent;
  border: 1px solid hsl(225, 15%, 25%);
  color: hsl(210, 20%, 80%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: hsla(250, 30%, 40%, 0.15);
    border-color: hsl(250, 40%, 45%);
  }
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-top: 1.25rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionButton = styled.button<{ $variant?: "save" | "pdf" | "slides" }>`
  padding: 0.8rem 0.9rem;
  border-radius: 11px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case "save":
        return `
          background: linear-gradient(135deg, hsl(160, 65%, 40%) 0%, hsl(160, 70%, 35%) 100%);
          color: white;
          box-shadow: 0 3px 12px hsla(160, 60%, 35%, 0.25);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px hsla(160, 60%, 35%, 0.35);
          }
        `;
      case "pdf":
        return `
          background: linear-gradient(135deg, hsl(0, 65%, 50%) 0%, hsl(0, 70%, 42%) 100%);
          color: white;
          box-shadow: 0 3px 12px hsla(0, 60%, 45%, 0.25);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px hsla(0, 60%, 45%, 0.35);
          }
        `;
      case "slides":
        return `
          background: linear-gradient(135deg, hsl(260, 60%, 55%) 0%, hsl(280, 65%, 45%) 100%);
          color: white;
          box-shadow: 0 3px 12px hsla(260, 55%, 45%, 0.25);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px hsla(260, 55%, 45%, 0.35);
          }
        `;
      default:
        return `
          background: hsl(225, 18%, 16%);
          border: 1px solid hsl(225, 15%, 22%);
          color: hsl(210, 20%, 80%);

          &:hover:not(:disabled) {
            background: hsl(225, 18%, 20%);
            border-color: hsl(250, 30%, 40%);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const PDFUploadSection = styled.div`
  margin-bottom: 1.25rem;
`;

export const PDFUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: hsl(220, 15%, 55%);
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const PDFUploadArea = styled.div<{ $hasFile?: boolean }>`
  position: relative;
  border: 2px dashed ${({ $hasFile }) => ($hasFile ? 'hsl(160, 50%, 40%)' : 'hsl(225, 15%, 22%)')};
  border-radius: 14px;
  background: ${({ $hasFile }) => ($hasFile ? 'hsla(160, 50%, 40%, 0.06)' : 'hsl(225, 20%, 10%)')};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: ${({ $hasFile }) => ($hasFile ? 'hsl(160, 50%, 50%)' : 'hsl(250, 40%, 45%)')};
    background: ${({ $hasFile }) => ($hasFile ? 'hsla(160, 50%, 40%, 0.1)' : 'hsla(250, 40%, 40%, 0.06)')};
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
    gap: 0.4rem;
    cursor: pointer;
    color: ${({ $hasFile }) => ($hasFile ? 'hsl(160, 50%, 50%)' : 'hsl(220, 12%, 45%)')};
    text-align: center;
    pointer-events: none;

    span {
      font-size: 0.9rem;
      font-weight: 500;
    }

    small {
      font-size: 0.78rem;
      opacity: 0.65;
    }

    svg {
      opacity: 0.7;
    }
  }
`;

export const GammaDownloadSection = styled.div`
  margin-top: 1.25rem;
  background: hsla(260, 40%, 30%, 0.12);
  border: 1px solid hsla(260, 40%, 40%, 0.2);
  border-radius: 14px;
  padding: 1.25rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const GammaDownloadTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: hsl(260, 50%, 72%);
  margin-bottom: 0.75rem;
`;

export const GammaDownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.65rem 1rem;
  margin-bottom: 0.45rem;
  background: hsl(225, 18%, 14%);
  border: 1px solid hsl(225, 15%, 20%);
  border-radius: 10px;
  color: hsl(210, 20%, 80%);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: hsla(260, 40%, 35%, 0.2);
    border-color: hsl(260, 40%, 40%);
    transform: translateX(3px);
  }

  svg:last-child {
    margin-left: auto;
    opacity: 0.4;
  }
`;

export const PDFClearButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: hsl(0, 60%, 50%);
  border: none;
  color: white;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.2s;

  &:hover {
    background: hsl(0, 65%, 55%);
    transform: scale(1.1);
  }
`;
