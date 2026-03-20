import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import AgentPage from './pages/AgentsPage'
import DashboardPage from './pages/DashboardPage'
import LiveTailPage from './pages/LiveTailPage'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'

function App() {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<Layout />}
				>
					<Route
						index
						element={<DashboardPage />}
					/>
					<Route
						path="login"
						element={<LoginPage />}
					/>
					<Route
						path="search"
						element={<SearchPage />}
					/>
					<Route
						path="live"
						element={<LiveTailPage />}
					/>
					<Route
						path="agent"
						element={<AgentPage />}
					/>
				</Route>
			</Routes>
		</>
	)
}

export default App
