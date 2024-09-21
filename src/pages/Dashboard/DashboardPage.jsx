import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReplayIcon from '@mui/icons-material/Replay';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentProducts: [],
    recentUsers: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Updated card data with dynamic values
  const cardData = [
    { title: 'Active Orders', number: dashboardData?.totalOrders, icon: <ShoppingCartIcon />, link: "/dashboard/all-orders" },
    { title: 'Active Users', number: dashboardData?.totalUsers, icon: <LoginIcon />, link: "/dashboard/all-users" },
    { title: 'Listed Products', number: dashboardData?.totalProducts, icon: <ProductionQuantityLimitsIcon />, link: "/dashboard/products" },
    { title: 'Blocked Users', number: dashboardData?.blockedUsers , icon: <ReplayIcon />, link: "/dashboard/all-users" }, // Changed icon to ReplayIcon
  ];
  

  return (
    <>
      <Grid container spacing={2}>
        {cardData.map((data, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={data.link}>
              <Card raised sx={{
                bgcolor: '#a9afc3', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: 1
              }}>
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ fontSize: "30px", fontWeight: 600 }}> {data.number}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: "20px" }}> {data.title}</Typography>
                </CardContent>
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: 2, p: 4, bgcolor: '#ff6060', borderRadius: "50%",
                  fontSize: "50px"
                }}>
                  {data.icon}
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Recent Products</Typography>
            <TableContainer component={Paper} sx={{ minHeight: '322px' }}>
              <Table sx={{ minHeight: '300px' }}>
                <TableHead sx={{ background: 'red' }}>
                  <TableRow>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>Title</TableCell>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>Price</TableCell>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Recent Users</Typography>
            <TableContainer component={Paper} sx={{ minHeight: '322px' }}>
              <Table >
                <TableHead>
                  <TableRow sx={{ background: 'red' }}>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>First Name</TableCell>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>Last Name</TableCell>
                    <TableCell sx={{ fontSize: 'bold', color: '#fff' }}>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardPage;
