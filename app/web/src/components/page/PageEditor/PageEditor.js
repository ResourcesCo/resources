/** @jsx jsx */
import {
  jsx,
  Container,
  Button,
  Flex,
  Spinner,
  Box,
  Label,
  Checkbox,
} from 'theme-ui'
import CodeEditor from '../CodeEditor'

const PageEditor = () => {
  const loading = false
  const save = () => undefined
  return (
    <Container sx={{ maxWidth: 768, p: 2, pt: 4, mx: 'auto' }}>
      <CodeEditor language="markdown" showLineNumbers={false} />
      <Flex sx={{ my: 3 }}>
        <div sx={{ flexGrow: 1 }}>
          <Button mr={2} onClick={save}>
            Save
            {loading && (
              <Spinner sx={{ color: 'white', size: 18, ml: 2, mb: '-3px' }} />
            )}
          </Button>
        </div>
        <Box>
          <Label mb={3} sx={{ userSelect: 'none' }}>
            <Checkbox />
            Preview
          </Label>
        </Box>
      </Flex>
    </Container>
  )
}

export default PageEditor
