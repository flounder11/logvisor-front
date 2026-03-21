import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const storedTheme = (() => {
	try {
		return localStorage.getItem('theme')
	} catch {
		return null
	}
})()

if (storedTheme === 'dark') {
	document.documentElement.classList.add('dark')
} else if (storedTheme === 'light') {
	document.documentElement.classList.remove('dark')
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
)
