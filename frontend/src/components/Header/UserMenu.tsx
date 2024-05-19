import {Grid, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {logout} from '../../store/user/userThunk';
import {AccountCircle} from '@mui/icons-material';
import {selectUser} from "../../store/user/userSlice.ts";


const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async () => {
    const confirmation = confirm('Are you sure?');
    if (confirmation) {
      await dispatch(logout());
      navigate('/');
    } else {
      handleClose();
    }
  };

  return (
    <>
      <Grid container alignItems='center'>
          <Typography><strong>{user?.username}</strong></Typography>
          <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
          >
              <AccountCircle />
          </IconButton>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={logoutUser}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;