import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Avatar, Box, Button, Divider, List, ListItem, ListItemText, TextField, Grid, Snackbar, Alert } from '@mui/material';
import { auth } from '../../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import ProfileService from '../../../services/ProfileService';
import Header from '../../../components/Header/Header';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [profileService, setProfileService] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const service = new ProfileService(user.uid);
        setProfileService(service);
        const userProfile = await service.getProfile();
        if (userProfile) {
          setProfile(userProfile);
        }
      } else {
        navigate('/user-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    try {
      if (profileService) {
        const success = await profileService.updateProfile(profile);
        if (success) {
          setSnackbar({
            open: true,
            message: 'Profile updated successfully',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/user-login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header />
      <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={user.photoURL}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
            </Avatar>
            <Typography component="h1" variant="h4" gutterBottom>
              {user.displayName || 'User Profile'}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
  
            <Divider sx={{ width: '100%', my: 3 }} />
  
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
  
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProfileUpdate}
              >
                Update Profile
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </Box>
  
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Paper>
      </Container>
    </div>
    );
}

export default UserProfile;