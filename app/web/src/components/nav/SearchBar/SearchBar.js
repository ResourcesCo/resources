import { InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const SearchBar = () => {
  return (
    <InputGroup maxWidth={150} mx={4}>
      <Input variant="filled" placeholder="Search" />
      <InputRightElement><SearchIcon /></InputRightElement>
    </InputGroup>
  )
}

export default SearchBar
