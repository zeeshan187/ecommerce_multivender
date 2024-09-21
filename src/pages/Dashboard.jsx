import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Routes
import { Routes, Route, Link } from 'react-router-dom';
import AllUser from './Dashboard/AllUsers';
import Complains from './Dashboard/Complain';
import ReturnProducts from './Dashboard/ReturnProducts';
import AllOrders from './Dashboard/AllOrders';
import DashboardPage from './Dashboard/DashboardPage';
import AddProduct from './Dashboard/AddProduct'
import UpdateProduct from './Dashboard/UpdateProduct'
import Logout from './Dashboard/Logout';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AllProducts from './Dashboard/AllProducts';
import './pages.css'
import AllDelievery from './Dashboard/AllDelievery';
const drawerWidth = 240;

export default function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Typography variant="h5" color="initial" sx={{
        color: "#a9afc3", width: "100%", height: "50px", fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center", mt: 2,
      }}>E_Com Market Place</Typography>
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard/main' },
          { text: 'Users', icon: <GroupIcon />, link: '/dashboard/all-users' },
          { text: 'Products', icon: <ShoppingCartIcon />, link: '/dashboard/products' },
          // { text: 'Delivery', icon: <LocalShippingIcon />, link: '/dashboard/delivery' },
          // { text: 'Return Products', icon: <AssignmentReturnIcon />, link: '/dashboard/return-products' },
          { text: 'Orders', icon: <ListAltIcon />, link: '/dashboard/all-orders' },
          // { text: 'Complains', icon: <RecordVoiceOverIcon />, link: '/dashboard/complains' },
          { text: 'Logout', icon: <ExitToAppIcon />, link: '/dashboard/logout' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link} sx={{ fontWeight: 600 }}>
              <ListItemIcon sx={{ color: "#FF0000" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: "#a9afc3" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', bgcolor: "#161819", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'red'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Dashboard</Typography>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#141414' },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, maxHeight: "100vh", pt: 10, color: '#a9afc3', backgroundColor:"white" }}
      >
        <Routes>
          <Route path="/main" element={<DashboardPage />} />
          <Route path="/all-users" element={<AllUser />} />

          <Route path="/products" element={<AllProducts />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          
          <Route path="/delivery" element={<AllDelievery />} />
          <Route path="/return-products" element={<ReturnProducts />} />
          <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/complains" element={<Complains />} />
          <Route path="/logout" element={<Typography><Logout /></Typography>} />
        </Routes>
      </Box>
    </Box>
  );
}
