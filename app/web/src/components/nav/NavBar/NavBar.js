import { useAuth } from '@redwoodjs/auth'
import {
  Flex,
  Box,
  Button,
  IconButton,
  Icon,
} from '@chakra-ui/react'
import { HamburgerIcon, BellIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import SearchBar from '../SearchBar'
import AvatarMenu from '../AvatarMenu'

const ThreeDotIcon = (props) => (
  <Icon viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
    />
  </Icon>
)

const NavBar = () => {
  const { logIn, logOut, isAuthenticated, currentUser } = useAuth()
  return (
    <Flex align="center" p={1}>
      <IconButton
        variant="ghost"
        icon={<HamburgerIcon w="6" h="6" color="gray.600" />}
      />
      <Box flexGrow={1}>
        <Button variant="ghost" px={1}>
          Home
        </Button>
      </Box>
      <SearchBar />
      {isAuthenticated ? (
        <AvatarMenu />
      ) : (
        <Button
          mx={2}
          colorScheme="blue"
          onClick={logIn}
        >
          Sign In
        </Button>
      )}
      <IconButton
        variant="ghost"
        icon={<BellIcon w="6" h="6" color="gray.600" />}
      />
      <IconButton
        variant="ghost"
        icon={<ThreeDotIcon w="6" h="6" color="gray.600" />}
      />
    </Flex>
  )
}

export default NavBar
