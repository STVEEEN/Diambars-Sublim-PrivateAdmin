import React from 'react';
import { Box, Button, Typography, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componente de paginación con estilos de DesignManagement
const StyledPagination = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  margin: theme.spacing(2, 0),
}));

const PageButton = styled(Button)(({ theme, active }) => ({
  minWidth: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: active ? 'linear-gradient(135deg, #1F64BF 0%, #032CA6 100%)' : 'transparent',
  color: active ? '#ffffff' : '#6B7280',
  border: active ? 'none' : `1px solid ${alpha('#1F64BF', 0.25)}`,
  fontSize: '14px',
  fontWeight: active ? 600 : 400,
  textTransform: 'none',
  fontFamily: "'Mona Sans'",
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: active ? '0 2px 8px rgba(31, 100, 191, 0.2)' : 'none',
  '&:hover': {
    backgroundColor: active ? 'linear-gradient(135deg, #1E5BA8 0%, #032A9A 100%)' : alpha('#1F64BF', 0.08),
    borderColor: active ? 'none' : alpha('#1F64BF', 0.4),
    transform: 'translateY(-1px)',
    boxShadow: active ? '0 4px 12px rgba(31, 100, 191, 0.3)' : '0 2px 6px rgba(1, 3, 38, 0.06)',
  },
  '&:disabled': {
    backgroundColor: 'transparent',
    color: alpha('#6B7280', 0.4),
    borderColor: alpha('#E5E7EB', 0.5),
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: alpha('#E5E7EB', 0.5),
      transform: 'none',
      boxShadow: 'none',
    },
  },
}));

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems,
  itemsPerPage 
}) => {
  // Calcular el rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Páginas iniciales
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Páginas finales
        pages.push(1);
        if (totalPages > 5) {
          pages.push('...');
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas del medio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  // Calcular el rango de items mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Información de paginación */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#032CA6', 
          opacity: 0.8, 
          fontFamily: "'Mona Sans'",
          fontWeight: 500
        }}
      >
        Mostrando {startItem}-{endItem} de {totalItems} elementos
      </Typography>

      {/* Controles de paginación */}
      <StyledPagination>
        {/* Botón anterior */}
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </PageButton>

        {/* Números de página */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Typography 
                variant="body2" 
                sx={{ 
                  minWidth: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#6B7280',
                  fontFamily: "'Mona Sans'",
                  fontWeight: 500
                }}
              >
                ...
              </Typography>
            ) : (
              <PageButton
                onClick={() => onPageChange(page)}
                active={currentPage === page}
              >
                {page}
              </PageButton>
            )}
          </React.Fragment>
        ))}

        {/* Botón siguiente */}
        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </PageButton>
      </StyledPagination>
    </Box>
  );
};

export default Pagination;
