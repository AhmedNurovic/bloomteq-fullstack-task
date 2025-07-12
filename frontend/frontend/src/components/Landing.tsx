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
import { usePageTitle } from '../hooks/usePageTitle';
import LeftSidePanel from './LeftSidePanel';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  usePageTitle();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', bgcolor: 'background.default' }}>
      {/* Mobile: Blue section at top - 50% height */}
      {isMobile && (
        <Box
          sx={{
            width: '100%',
            background: '#096DD9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '50vh',
            py: 2,
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
            px: 2,
          }}>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 36, color: 'white', margin: 0, letterSpacing: 2, textAlign: 'center' }}>LOGO</h1>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 22,
                lineHeight: '32px',
                letterSpacing: 0,
                color: 'white',
                mt: 2,
                textAlign: 'center',
                maxWidth: 400,
                mb: 1,
              }}
            >
              Time Track Management <br /> Web App
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 15,
                lineHeight: '22px',
                letterSpacing: 0,
                color: 'white',
                opacity: 0.95,
                mt: 1,
                textAlign: 'center',
                maxWidth: 400,
                mb: 1,
              }}
            >
              Easily track and manage your working hours with our intuitive web app. Perfect for teams and individuals looking to stay organized, monitor productivity, and simplify time logging.
            </Typography>
          </Box>
          {/* Decorative dots */}
          <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
            <img src={OrangeDots} alt="Decorative dots" style={{ width: 60, height: 56 }} />
          </Box>
        </Box>
      )}

      {/* Desktop: LeftSidePanel for 50/50 split */}
      {!isMobile && <LeftSidePanel />}

      {/* Cards section - 50% on mobile, 50% on desktop */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: '50vh', md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          py: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: { xs: 20, md: 28 } }}>
              Join Us!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: { xs: 14, md: 16 } }}>
              To begin this journey, register to create an account or sign in if you have an account.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {/* Register Card */}
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                minHeight: { xs: 64, md: 90 },
                mb: { xs: 1, md: 0 },
                borderRadius: { xs: 3, md: 3 },
                px: { xs: 1, md: 0 },
                py: { xs: 0.5, md: 0 },
                boxShadow: '0 20px 12px 0 rgba(9, 109, 217, 0.06)',
                '&:hover': {
                  border: '1.5px solid #096DD9',
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => navigate('/register')}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
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
                minHeight: { xs: 64, md: 90 },
                color: '#096DD9',
                bgcolor: 'white',
                boxShadow: '0 20px 12px 0 rgba(9, 109, 217, 0.06)',
                '&:hover': {
                  border: '1.5px solid #096DD9',
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
                borderRadius: { xs: 3, md: 3 },
                px: { xs: 1, md: 0 },
                py: { xs: 0.5, md: 0 },
              }}
              onClick={() => navigate('/login')}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
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