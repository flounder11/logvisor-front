import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function AppHeader() {
	const navigate = useNavigate()

	return (
		<header className="flex justify-between max-w-7xl mx-auto mt-6">
			<div className="flex gap-4">
				<Button
					onClick={() => navigate('/')}
					size="lg"
					variant="outline"
				>
					Dashboard
				</Button>
				<Button
					onClick={() => navigate('/search')}
					size="lg"
					variant="outline"
				>
					Search page
				</Button>
				<Button
					onClick={() => navigate('/live')}
					size="lg"
					variant="outline"
				>
					Live Tail
				</Button>
				<Button
					onClick={() => navigate('agent')}
					size="lg"
					variant="outline"
				>
					Agents page
				</Button>
			</div>
			<Button
				size="lg"
				onClick={() => navigate('/login')}
			>
				Login
			</Button>
		</header>
	)
}
