import { useAuth } from '@redwoodjs/auth'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar
} from "@chakra-ui/react"

const AvatarMenu = () => {
  const { logOut, currentUser } = useAuth()
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<Avatar size="sm" name={currentUser.email} />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem onClick={logOut}>Log Out</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default AvatarMenu
