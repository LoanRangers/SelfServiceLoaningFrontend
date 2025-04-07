import { SwipeableDrawer, List, ListItem, ListItemText, ListItemButton, IconButton, Box, Divider, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Drawer({ open, onClose, handleLogin, handleLogout, user }) {

  {/* Links on the sidebar */}
  const drawerLinks = [
    { text: "Loaning History", path: "/loaninghistory" },
    { text: "Create Items", path: "/CreateItem" },
    { text: "Rooms", path: "/rooms" },
    { text: "Create locations", path: "/CreateLocation" },
  ]

  return (
    <SwipeableDrawer
      variant="temporary"
      open={open}
      onClose={onClose}
    >
      <IconButton onClick={onClose} className='drawer-button' sx={{ color: 'white'}}>
        <MenuIcon />
      </IconButton>
      <Box
        sx={{ width: 250, color: 'white', paddingTop: '60px' }}
      >
      <Divider sx={{ borderColor: 'white' }} />
        {!user && (
          <List>
            <ListItem>
              <Typography variant="body1" sx={{ color: 'white', maxWidth: '200px', textAlign: 'center' }}>
                To loan and manage items, log in
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleLogin} sx={{ border: '1px solid white', justifyContent: 'center' }}>
                <Typography variant="button" sx={{ color: 'white' }}>
                  Login
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>
        )}
        {user && (
          
          <List>
            <ListItem disablePadding>
              <ListItemButton sx={{ justifyContent: 'center' }}>
                <AccountCircleIcon sx={{ color: 'white', marginRight: '10px' }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user.name}
                </Typography>
              </ListItemButton>
            </ListItem>
            {/* Buttons on the sidebar */}
            {drawerLinks.map((link) =>(
              <ListItem disablePadding key={link.text}>
                <ListItemButton component={Link} to={link.path}>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {user && (
          <List>
            <ListItem>
              <ListItemButton onClick={handleLogout} sx={{ border: '1px solid white', justifyContent: 'center' }}>
                <Typography variant="button" sx={{ color: 'white' }}>
                  Logout
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Box>
    </SwipeableDrawer>
  )
}
export default Drawer