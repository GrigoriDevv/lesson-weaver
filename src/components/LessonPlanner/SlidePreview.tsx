import React from 'react';
import styled from 'styled-components';
import { LessonPlan } from './types';
import { ExternalLink, Copy, X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #1e1e2e, #12121a);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Slide = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  
  h3 {
    color: #a78bfa;
    font-size: 1.125rem;
    margin: 0 0 0.75rem 0;
  }
  
  p {
    color: #cbd5e1;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }
  
  ul {
    margin: 0.75rem 0 0 0;
    padding-left: 1.25rem;
    color: #94a3b8;
    
    li {
      margin-bottom: 0.25rem;
    }
  }
`;

const SlideNumber = styled.span`
  display: inline-block;
  background: rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
`;

const Duration = styled.span`
  float: right;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ $primary }) => $primary ? `
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    border: none;
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #e2e8f0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `}
`;

const Message = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #60a5fa;
  font-size: 0.9rem;
`;

interface SlidePreviewProps {
  lessonPlan: LessonPlan;
  gammaResult?: {
    success: boolean;
    url?: string;
    content?: string;
    gammaUrl?: string;
    message?: string;
  } | null;
  onClose: () => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ lessonPlan, gammaResult, onClose }) => {
  const handleCopyContent = async () => {
    let content = `# ${lessonPlan.subject}\n\n`;
    content += `## Objetivo\n${lessonPlan.objective}\n\n`;
    
    lessonPlan.sections.forEach((section, index) => {
      content += `## ${index + 1}. ${section.title} (${section.duration} min)\n`;
      content += `${section.content}\n\n`;
      if (section.activities && section.activities.length > 0) {
        content += `### Atividades\n`;
        section.activities.forEach((activity) => {
          content += `- ${activity}\n`;
        });
        content += '\n';
      }
    });

    await navigator.clipboard.writeText(content);
    alert('Conteúdo copiado para a área de transferência!');
  };

  const handleOpenGamma = () => {
    if (gammaResult?.url) {
      window.open(gammaResult.url, '_blank');
    } else {
      window.open('https://gamma.app/create', '_blank');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>📊 Visualização dos Slides</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {gammaResult?.message && (
            <Message>{gammaResult.message}</Message>
          )}
          
          <SlideContainer>
            {/* Title Slide */}
            <Slide>
              <SlideNumber>Slide 1 - Capa</SlideNumber>
              <h3>{lessonPlan.subject}</h3>
              <p><strong>Objetivo:</strong> {lessonPlan.objective}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Duração Total:</strong> {lessonPlan.totalDuration} minutos
              </p>
            </Slide>
            
            {/* Content Slides */}
            {lessonPlan.sections.map((section, index) => (
              <Slide key={index}>
                <SlideNumber>Slide {index + 2}</SlideNumber>
                <Duration>{section.duration} min</Duration>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
                {section.activities && section.activities.length > 0 && (
                  <ul>
                    {section.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                )}
              </Slide>
            ))}
          </SlideContainer>
        </ModalContent>
        
        <ModalFooter>
          <ActionButton onClick={handleCopyContent}>
            <Copy size={16} />
            Copiar Conteúdo
          </ActionButton>
          <ActionButton $primary onClick={handleOpenGamma}>
            <ExternalLink size={16} />
            {gammaResult?.success ? 'Ver no Gamma' : 'Abrir Gamma'}
          </ActionButton>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default SlidePreview;
