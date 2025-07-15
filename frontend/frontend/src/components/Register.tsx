import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import OrangeDots from '../assets/orange-dots.svg';
import BlackArrow from '../assets/black-arrow.svg';
import BlackArrowSmall from '../assets/black-arrow-small.svg';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  usePageTitle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setIsLoading(true);
    try {
      const result = await register(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left column: logo, dots, text block, corner shape, arrow */}
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
        {/* Logo at top left, always on desktop */}
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10, color: 'white', fontSize: { xs: 18, md: 24 }, display: { xs: 'none', md: 'block' } }}>
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
      {/* Right: Registration form centered, with back button */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Centered logo above the form only on mobile */}
        <Box sx={{ width: '100%', display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 24, left: 0, zIndex: 3 }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 32, color: '#096DD9', margin: 0, letterSpacing: 2 }}>LOGO</h1>
        </Box>
        {/* Sleek blue accent (dots) in top right, behind form */}
        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1, opacity: 0.15 }}>
          <img src={OrangeDots} alt="Blue accent" style={{ width: 80, height: 80 }} />
        </Box>
        <Container sx={{ px: { xs: 0.5, sm: 2, md: 0 }, pt: { xs: 8, md: 10 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }} maxWidth="sm">
          <Card sx={{
            p: { xs: 1.5, sm: 3, md: 4 },
            maxWidth: { xs: '95vw', sm: 400 },
            mx: 'auto',
          }}>
            <CardContent sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: { xs: 2, md: 4 } }}>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: { xs: 24, sm: 26, md: 30 }, lineHeight: { xs: '32px', md: '40px' }, textAlign: 'left', color: 'black', mb: 1 }}>
                    Register
                  </Typography>
                  <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: { xs: 13, sm: 14, md: 15 }, lineHeight: { xs: '20px', md: '22px' }, textAlign: 'left', color: 'rgba(0,0,0,0.6)' }}>
                    For the purpose of industry regulation, your details are required.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    error={Boolean(error)}
                    helperText={error && <span style={{ color: 'rgba(255,77,79,0.7)', fontSize: 12, lineHeight: '18px', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{error}</span>}
                    sx={{
                      background: 'white',
                      borderRadius: 0.5,
                      boxShadow: '0 2px 12px 0 rgba(9, 109, 217, 0.06)',
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: 15, md: 14 },
                        lineHeight: '22px',
                        borderRadius: 0.5,
                        background: 'white',
                        borderColor: '#E6E6E6',
                        padding: { xs: '12px 10px', md: '10px 8px' },
                        '& fieldset': {
                          borderColor: '#E6E6E6',
                        },
                        '&:hover fieldset': {
                          borderColor: '#096DD9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#096DD9',
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#FF4D4F',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Create Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    error={Boolean(error) || Boolean(password && confirmPassword && password !== confirmPassword)}
                    helperText={error && <span style={{ color: 'rgba(255,77,79,0.7)', fontSize: 12, lineHeight: '18px', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{error}</span>}
                    sx={{
                      background: 'white',
                      borderRadius: 0.5,
                      boxShadow: '0 2px 12px 0 rgba(9, 109, 217, 0.06)',
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: 15, md: 14 },
                        lineHeight: '22px',
                        borderRadius: 0.5,
                        background: 'white',
                        borderColor: '#E6E6E6',
                        padding: { xs: '12px 10px', md: '10px 8px' },
                        '& fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#E6E6E6',
                        },
                        '&:hover fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#096DD9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#096DD9',
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#FF4D4F',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Retype Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    error={Boolean(error) || Boolean(password && confirmPassword && password !== confirmPassword)}
                    helperText={error && <span style={{ color: 'rgba(255,77,79,0.7)', fontSize: 12, lineHeight: '18px', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>{error}</span>}
                    sx={{
                      background: 'white',
                      borderRadius: 0.5,
                      boxShadow: '0 2px 12px 0 rgba(9, 109, 217, 0.06)',
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: 15, md: 14 },
                        lineHeight: '22px',
                        borderRadius: 0.5,
                        background: 'white',
                        borderColor: '#E6E6E6',
                        padding: { xs: '12px 10px', md: '10px 8px' },
                        '& fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#E6E6E6',
                        },
                        '&:hover fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#096DD9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor:
                            password && confirmPassword
                              ? password === confirmPassword
                                ? '#27AE60'
                                : '#FF4D4F'
                              : '#096DD9',
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#FF4D4F',
                        },
                      },
                    }}
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#096DD9',
                      borderRadius: 0.5,
                      '&:hover': {
                        backgroundColor: '#075cb2',
                      },
                      textTransform: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: 17, md: 16 },
                      minHeight: 48,
                      mt: { xs: 1, md: 2 },
                    }}
                    fullWidth
                    startIcon={isLoading ? <CircularProgress size={24} /> : <PersonAddIcon sx={{ fontSize: { xs: 22, md: 20 } }} />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                  <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                      Log in
                    </Link>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
          {/* Back button: desktop (top left, text+arrow), mobile (bottom center, icon) */}
          {/* Desktop back button */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              position: 'absolute',
              top: 32,
              left: 32,
              cursor: 'pointer',
              zIndex: 10,
            }}
            onClick={() => navigate(-1)}
          >
            <img src={BlackArrowSmall} alt="back" style={{ width: 20, height: 20, marginRight: 8, filter: 'invert(0%)' }} />
            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 16, color: 'black' }}>Back</Typography>
          </Box>
          {/* Mobile back button */}
          <Box sx={{ width: '100%', display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', mt: 4, mb: 2 }}>
            <Box
              onClick={() => navigate(-1)}
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'white',
                border: '2.5px solid #096DD9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(9, 109, 217, 0.10)',
                transition: 'background 0.2s, border 0.2s',
                '&:hover': {
                  bgcolor: '#f0f6fc',
                  borderColor: '#075cb2',
                },
              }}
            >
              <img
                src={BlackArrowSmall}
                alt="back"
                style={{
                  width: 28,
                  height: 28,
                  filter: 'invert(17%) sepia(97%) saturate(749%) hue-rotate(186deg) brightness(92%) contrast(101%)',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Register; 