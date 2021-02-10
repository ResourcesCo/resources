import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'
import { Flex, Button } from '@chakra-ui/react'

const HomePage = () => {
  const { logIn, logOut, isAuthenticated, currentUser } = useAuth()

  return (
    <Flex align="center" justify="flex-end" p={5}>
      {isAuthenticated && currentUser.email}
      {isAuthenticated ? (
        <Button
          colorScheme="blue"
          mx={2}
          onClick={async () => {
            await logOut()
            navigate(routes.home())
          }}
        >
          Sign Out
        </Button>
      ) : (
        <Button
          colorScheme="blue"
          mx={2}
          onClick={async () => {
            await logIn()
            navigate(routes.home())
          }}
        >
          Sign In
        </Button>
      )}
    </Flex>
  )
}

export default HomePage
