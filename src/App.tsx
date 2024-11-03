import { AuthProvider } from "./Context/AuthContext"

import App2 from "./App2"

function App() {
  return (
    <AuthProvider>
      <App2 />
    </AuthProvider>
  )
}

export default App
