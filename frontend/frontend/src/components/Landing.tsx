import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import OrangeDots from '../assets/orange-dots.svg';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', bgcolor: 'background.default' }}>
      {/* Left column: logo, dots, text block, corner shape, arrow */}
      {/* Top blue section for mobile, left for desktop */}
      <Box
        sx={{
          width: '100%',
          background: '#096DD9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: { xs: 260, md: '100vh' },
          py: 0,
          overflow: 'hidden',
        }}
      >
        {/* Centered content (LOGO and intro text) */}
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          zIndex: 2,
        }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 36, color: 'white', margin: 0, letterSpacing: 2, textAlign: 'center' }}>LOGO</h1>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: { xs: 22, md: 30 },
              lineHeight: { xs: '32px', md: '40px' },
              letterSpacing: 0,
              color: 'white',
              mt: 2,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            Time Track Management <br /> Web App
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: { xs: 14, md: 16 },
              lineHeight: { xs: '20px', md: '22px' },
              letterSpacing: 0,
              color: 'white',
              opacity: 0.95,
              mt: 1,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            Easily track and manage your working hours with our intuitive web app. Perfect for teams and individuals looking to stay organized, monitor productivity, and simplify time logging.
          </Typography>
        </Box>
        {/* Decorative dots only on desktop */}
        <Box sx={{ position: 'absolute', top: { xs: 12, md: 120 }, right: { xs: 12, md: '25%' }, zIndex: 1, display: { xs: 'none', md: 'block' } }}>
          <img src={OrangeDots} alt="Decorative dots" style={{ width: 60, height: 56 }} />
        </Box>
        {/* Hide arrow and corner shape on mobile */}
        <Box sx={{ position: 'absolute', bottom: 32, right: 32, zIndex: 1, display: { xs: 'none', md: 'block' } }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="24" width="8" height="8" fill="white" />
            <rect x="24" y="0" width="8" height="8" fill="white" />
          </svg>
        </Box>
      </Box>

      {/* Cards section */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'center' },
          bgcolor: 'background.default',
          minHeight: { xs: 320, md: '100vh' },
          pt: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: { xs: 20, md: 28 } }}>
              Join Us!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: { xs: 14, md: 16 } }}>
              To begin this journey, register to create an account or sign in if you have an account.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 }, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {/* Register Card */}
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                minHeight: { xs: 72, md: 90 },
                mb: { xs: 2, md: 0 },
                boxShadow: '0 20px 12px 0 rgba(9, 109, 217, 0.06)',
                '&:hover': {
                  border: '1.5px solid #096DD9',
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => navigate('/register')}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* No logo here */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: 16, md: 18 } }}>Register</Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', letterSpacing: '0.25px', fontSize: { xs: 13, md: 15 } }}>
                      Create an account to track all your activities.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Login Card */}
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                minHeight: { xs: 72, md: 90 },
                color: '#096DD9',
                bgcolor: 'white',
                boxShadow: '0 20px 12px 0 rgba(9, 109, 217, 0.06)',
                '&:hover': {
                  border: '1.5px solid #096DD9',
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => navigate('/login')}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* No logo here */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: 16, md: 18 } }}>Log in</Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', letterSpacing: '0.25px', fontSize: { xs: 13, md: 15 } }}>
                      Log in to your account to continue tracking all your activities.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 