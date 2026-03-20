import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function Layout() {
	return (
		<div>
			<AppHeader />

			<main>
				<Outlet />
			</main>
		</div>
	)
}
