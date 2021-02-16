import { Link, routes } from '@redwoodjs/router'
import PageEditor from '../../components/page/PageEditor/PageEditor'
import AppLayout from '../../layouts/AppLayout'

const NewPage = () => {
  return (
    <AppLayout>
      <PageEditor />
    </AppLayout>
  )
}

export default NewPage
