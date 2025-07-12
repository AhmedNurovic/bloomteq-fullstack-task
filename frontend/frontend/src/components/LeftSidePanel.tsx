import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import OrangeDots from '../assets/orange-dots.svg';
import BlackArrow from '../assets/black-arrow.svg';

const LeftSidePanel: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: { xs: 0, md: '50%' },
        display: { xs: 'none', md: 'flex' },
        background: '#096DD9',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '100vh',
        py: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo at top left, always */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10, color: 'white', fontSize: { xs: 18, md: 24 } }}>
        <h1 style={{ fontSize: 'inherit', margin: 0 }}>LOGO</h1>
      </Box>
      {/* Decorative dots, now at right: 25% of the blue div's width */}
      {typeof window !== 'undefined' && window.innerWidth >= theme.breakpoints.values.md && (
        <Box sx={{ position: 'absolute', top: { xs: 40, md: 120 }, right: { xs: 8, md: '25%' }, zIndex: 1, display: { xs: 'none', md: 'block' } }}>
          <img src={OrangeDots} alt="Decorative dots" style={{ width: 40, height: 36, maxWidth: '15vw' }} />
        </Box>
      )}
      {/* Centered text block, now centered between 25% left and 25% right */}
      <Box sx={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', flex: 1, ml: '25%', mr: '25%', width: '50%' }}>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: 30,
            lineHeight: '40px',
            letterSpacing: 0,
            color: 'white',
            mb: 2,
            textAlign: 'left',
            maxWidth: 340,
          }}
        >
          Time Track Management <br /> Web App
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '22px',
            letterSpacing: 0,
            color: 'white',
            opacity: 0.95,
            textAlign: 'left',
            maxWidth: 340,
          }}
        >
          Easily track and manage your working hours with our intuitive web app. Perfect for teams and individuals looking to stay organized, monitor productivity, and simplify time logging.
        </Typography>
        {/* Arrow underneath text, now at right: 25% */}
        {typeof window !== 'undefined' && window.innerWidth >= theme.breakpoints.values.md && (
          <Box sx={{ mt: 4, position: 'absolute', right: '25%', bottom: '25%', zIndex: 2 }}>
            <img src={BlackArrow} alt="arrow" style={{ width: 34, height: 33 }} />
          </Box>
        )}
      </Box>
      {/* Corner shape */}
      <Box sx={{ position: 'absolute', bottom: 32, right: 32, zIndex: 1 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="24" width="8" height="8" fill="white" />
          <rect x="24" y="0" width="8" height="8" fill="white" />
        </svg>
      </Box>
    </Box>
  );
};

export default LeftSidePanel; 