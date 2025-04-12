import React from 'react';
import './AboutUs.css';
import { Box, Container, Typography, Paper, Grid, Divider } from '@mui/material';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const AboutUs = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pt: 8, pb: 6 }}>
      <Header />
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            About Bharathy Nool Nilayam
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Company Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Bharathy Nool Nilayam - Lending Library And Sales Of Books is a well-established Proprietorship Firm with over 22 years of experience in the publishing industry. Founded on July 1st, 2002, we have been serving our community with quality publications and library services.
            </Typography>
            <Typography variant="body1" paragraph>
              Our major activity focuses on Services, specifically in Publishing activities, where we specialize in the publishing of journals and periodicals. We take pride in being classified as a Micro enterprise, demonstrating our commitment to sustainable growth and community service.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Organization Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Type of Enterprise</Typography>
                <Typography variant="body1" paragraph>Micro Enterprise (2023-24)</Typography>

                <Typography variant="subtitle1" color="text.secondary">Organization Type</Typography>
                <Typography variant="body1" paragraph>Proprietary</Typography>

                <Typography variant="subtitle1" color="text.secondary">Date of Incorporation</Typography>
                <Typography variant="body1" paragraph>July 1st, 2002</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Major Activity</Typography>
                <Typography variant="body1" paragraph>Services (Publishing activities)</Typography>

                <Typography variant="subtitle1" color="text.secondary">Social Category</Typography>
                <Typography variant="body1" paragraph>OBC</Typography>

                <Typography variant="subtitle1" color="text.secondary">Business Commencement</Typography>
                <Typography variant="body1" paragraph>July 1st, 2002</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Main Branch</Typography>
                <Typography variant="body1" paragraph>
                  Near Sivankovil,<br />
                  TMB Bank Backside,<br />
                  Pen Paadasalai Street,<br />
                  Sivakasi, Tamil Nadu - 626123
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="text.secondary">Contact Information</Typography>
                <Typography variant="body1" paragraph>
                  City: Sivakasi<br />
                  District: Virudhunagar<br />
                  State: Tamil Nadu<br />
                  Pin Code: 626123
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default AboutUs;
