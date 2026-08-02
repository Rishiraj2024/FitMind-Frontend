import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" richColors />
      <AppRoutes />
    </>
  )
}

export default App
