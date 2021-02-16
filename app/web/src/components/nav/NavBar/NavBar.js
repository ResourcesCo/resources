import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { Flex, Box, IconButton, Button, Heading } from 'theme-ui'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsBell, BsFilePlus, BsPerson, BsThreeDots } from 'react-icons/bs'
import AvatarMenu from '../AvatarMenu'

const NavBar = () => {
  const { logIn, logOut, isAuthenticated, currentUser } = useAuth()
  return (
    <Flex sx={{p: 1, alignItems: 'center', borderBottom: 'divider'}}>
      <IconButton variant="ghost" px={1}>
        <GiHamburgerMenu />
      </IconButton>
      <Box sx={{flexGrow: 1}}>
        <Heading sx={{fontSize: 3, fontWeight: 500, mx: 1}}>Home</Heading>
      </Box>
      <Link to={routes.new()}>
      <IconButton>
        <BsFilePlus />
      </IconButton>
      </Link>
      <IconButton>
        <BsBell />
      </IconButton>
      {isAuthenticated ? (
        <AvatarMenu />
      ) : (
        <>
          <Button
            onClick={logIn}
            sx={{display: ['none', 'block', 'block']}}
            sx={{fontSize: 1, mx: 1, py: 1}}
          >
            Sign In
          </Button>
          <IconButton
            onClick={logIn}
            sx={{display: ['block', 'none', 'none']}}
          ><BsPerson /></IconButton>
        </>
      )}
      <IconButton>
        <BsThreeDots />
      </IconButton>
    </Flex>
  )
}

export default NavBar
