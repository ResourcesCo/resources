/** @jsx jsx */
import { jsx, IconButton } from 'theme-ui'
import { useAuth } from '@redwoodjs/auth'
import { BsPerson } from 'react-icons/bs'
import {
  Menu,
  MenuItem,
} from '@szhsin/react-menu';

const AvatarMenu = () => {
  const { logOut, currentUser } = useAuth()
  return (
    <Menu menuButton={<IconButton><BsPerson /></IconButton>}>
      <MenuItem>Profile</MenuItem>
      <MenuItem onClick={logOut}>Log Out</MenuItem>
    </Menu>
  )
}

export default AvatarMenu
