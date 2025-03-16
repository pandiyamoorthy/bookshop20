import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import { Dashboard, Upload, ListAlt, People, Settings as SettingsIcon, Visibility, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f4f6f8',
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(90deg, #3f51b5, #1e88e5)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: '#ffffff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  overflow: 'auto',
}));

const ToolbarStyled = styled('div')(({ theme }) => theme.mixins.toolbar);

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#e3f2fd',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
  },
}));

function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Upload Books', icon: <Upload />, path: '/dashboard/upload-products' },
    { text: 'Order Details', icon: <ListAlt />, path: '/dashboard/order-details' },
    { text: 'Manage Users', icon: <People />, path: '/dashboard/manage-users' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
    { text: 'View Books', icon: <Visibility />, path: '/dashboard/view-products' },
    { text: 'Edit Book', icon: <Edit />, path: '/dashboard/edit-books' }, // Updated path
  ];

  return (
    <Root>
      <CssBaseline />
      <AppBarStyled position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent">
        <ToolbarStyled />
        <List>
          {menuItems.map((item, index) => (
            <ListItemStyled button key={index} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemStyled>
          ))}
        </List>
      </DrawerStyled>
      <Content>
        <ToolbarStyled />
        <Outlet />
      </Content>
    </Root>
  );
}

export default AdminDashboard;
