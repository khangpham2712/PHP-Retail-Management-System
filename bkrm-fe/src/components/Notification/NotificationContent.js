import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function NotificationContent({children}) {
  return (
    <List sx={{ width: '100%', maxWidth: 300, overflow: 'auto',
    maxHeight: 500, bgcolor: 'background.paper' }}>
      {children}
    </List>
  );
}
