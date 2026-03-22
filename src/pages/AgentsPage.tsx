import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { apiClient } from '@/shared/api/api-client'
import {
	normalizeAgentGroupRecord,
	normalizeAgentRecord,
	type AgentGroupRecord,
	type AgentRecord
} from '@/shared/types/agents'
import {
	FolderTree,
	Network,
	PlusCircle,
	RefreshCw,
	Save,
	Server,
	Users
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type AgentFormState = {
	agentId: string
	name: string
	host: string
	hostIp: string
	status: string
	bufferedCount: string
	groupId: string
}

type GroupFormState = {
	name: string
	description: string
	agentIds: string[]
}

function createEmptyAgentForm(): AgentFormState {
	return {
		agentId: '',
		name: '',
		host: '',
		hostIp: '',
		status: 'offline',
		bufferedCount: '0',
		groupId: '0'
	}
}

function createEmptyGroupForm(): GroupFormState {
	return {
		name: '',
		description: '',
		agentIds: []
	}
}

function toAgentForm(agent: AgentRecord): AgentFormState {
	return {
		agentId: agent.agentId,
		name: agent.name,
		host: agent.host,
		hostIp: agent.hostIp,
		status: agent.status || 'offline',
		bufferedCount: String(agent.bufferedCount),
		groupId: String(agent.groupId)
	}
}

function toGroupForm(group: AgentGroupRecord): GroupFormState {
	return {
		name: group.name,
		description: group.description,
		agentIds: group.agents.map(agent => agent.agentId)
	}
}

function getStatusTone(status: string) {
	const normalizedStatus = status.toLowerCase()

	if (normalizedStatus === 'online') {
		return 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/20'
	}

	if (normalizedStatus === 'offline') {
		return 'bg-red-500/12 text-red-700 ring-red-500/20'
	}

	return 'bg-amber-500/12 text-amber-700 ring-amber-500/20'
}

function formatDate(value: string) {
	if (!value) {
		return 'unknown'
	}

	const parsed = Date.parse(value)

	if (Number.isNaN(parsed)) {
		return value
	}

	return new Date(parsed).toLocaleString()
}

export default function AgentPage() {
	const [agents, setAgents] = useState<AgentRecord[]>([])
	const [groups, setGroups] = useState<AgentGroupRecord[]>([])
	const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
	const [agentForm, setAgentForm] = useState<AgentFormState>(createEmptyAgentForm)
	const [groupForm, setGroupForm] = useState<GroupFormState>(createEmptyGroupForm)
	const [loading, setLoading] = useState(false)
	const [agentSubmitting, setAgentSubmitting] = useState(false)
	const [groupSubmitting, setGroupSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [notice, setNotice] = useState<string | null>(null)

	const selectedAgent =
		agents.find(agent => agent.agentId === selectedAgentId) ?? null
	const selectedGroup = groups.find(group => group.id === selectedGroupId) ?? null

	const onlineAgentsCount = agents.filter(
		agent => agent.status.toLowerCase() === 'online'
	).length

	const loadAgents = async () => {
		const data = await apiClient.request<unknown[]>({
			method: 'GET',
			path: 'agents'
		})

		return Array.isArray(data) ? data.map(item => normalizeAgentRecord(item)) : []
	}

	const loadGroups = async () => {
		const data = await apiClient.request<unknown[]>({
			method: 'GET',
			path: 'agent-groups'
		})

		return Array.isArray(data)
			? data.map(item => normalizeAgentGroupRecord(item))
			: []
	}

	const loadAllData = async () => {
		try {
			setLoading(true)
			setError(null)

			const [nextAgents, nextGroups] = await Promise.all([loadAgents(), loadGroups()])

			setAgents(nextAgents)
			setGroups(nextGroups)

			if (
				selectedAgentId &&
				!nextAgents.some(agent => agent.agentId === selectedAgentId)
			) {
				setSelectedAgentId(null)
				setAgentForm(createEmptyAgentForm())
			}

			if (selectedGroupId && !nextGroups.some(group => group.id === selectedGroupId)) {
				setSelectedGroupId(null)
				setGroupForm(createEmptyGroupForm())
			}
		} catch (loadError) {
			setError(
				loadError instanceof Error ? loadError.message : 'Не удалось загрузить данные.'
			)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadAllData()
	}, [])

	const openAgent = async (agentId: string) => {
		try {
			setError(null)
			const agent = normalizeAgentRecord(
				await apiClient.request<unknown>({
					method: 'GET',
					path: `agents/${encodeURIComponent(agentId)}`
				})
			)

			setSelectedAgentId(agent.agentId)
			setAgentForm(toAgentForm(agent))
			setAgents(currentAgents =>
				currentAgents.map(currentAgent =>
					currentAgent.agentId === agent.agentId ? agent : currentAgent
				)
			)
		} catch (loadError) {
			setError(
				loadError instanceof Error ? loadError.message : 'Не удалось загрузить агента.'
			)
		}
	}

	const openGroup = async (groupId: number) => {
		try {
			setError(null)
			const group = normalizeAgentGroupRecord(
				await apiClient.request<unknown>({
					method: 'GET',
					path: `agent-groups/${groupId}`
				})
			)

			setSelectedGroupId(group.id)
			setGroupForm(toGroupForm(group))
			setGroups(currentGroups =>
				currentGroups.map(currentGroup =>
					currentGroup.id === group.id ? group : currentGroup
				)
			)
		} catch (loadError) {
			setError(
				loadError instanceof Error ? loadError.message : 'Не удалось загрузить группу.'
			)
		}
	}

	const handleCreateNewAgent = () => {
		setSelectedAgentId(null)
		setAgentForm(createEmptyAgentForm())
		setNotice(null)
	}

	const handleCreateNewGroup = () => {
		setSelectedGroupId(null)
		setGroupForm(createEmptyGroupForm())
		setNotice(null)
	}

	const handleAgentSubmit = async () => {
		try {
			setAgentSubmitting(true)
			setError(null)
			setNotice(null)

			if (selectedAgentId) {
				const updatedAgent = normalizeAgentRecord(
					await apiClient.request<unknown>({
						method: 'PUT',
						path: `agents/${encodeURIComponent(selectedAgentId)}`,
						body: {
							name: agentForm.name,
							status: agentForm.status,
							groupId: Number(agentForm.groupId) || 0
						}
					})
				)

				await loadAllData()
				setSelectedAgentId(updatedAgent.agentId)
				setAgentForm(toAgentForm(updatedAgent))
				setNotice(`Агент ${updatedAgent.agentId} обновлён.`)
				return
			}

			const createdAgent = normalizeAgentRecord(
				await apiClient.request<unknown>({
					method: 'POST',
					path: 'agents',
					body: {
						agentId: agentForm.agentId,
						name: agentForm.name,
						host: agentForm.host,
						hostIp: agentForm.hostIp,
						status: agentForm.status,
						bufferedCount: Number(agentForm.bufferedCount) || 0,
						groupId: Number(agentForm.groupId) || 0
					}
				})
			)

			await loadAllData()
			setSelectedAgentId(createdAgent.agentId)
			setAgentForm(toAgentForm(createdAgent))
			setNotice(`Агент ${createdAgent.agentId} создан.`)
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: 'Не удалось сохранить агента.'
			)
		} finally {
			setAgentSubmitting(false)
		}
	}

	const handleGroupSubmit = async () => {
		try {
			setGroupSubmitting(true)
			setError(null)
			setNotice(null)

			if (selectedGroupId !== null) {
				const updatedGroup = normalizeAgentGroupRecord(
					await apiClient.request<unknown>({
						method: 'PUT',
						path: `agent-groups/${selectedGroupId}`,
						body: {
							name: groupForm.name,
							description: groupForm.description,
							agentIds: groupForm.agentIds
						}
					})
				)

				await loadAllData()
				setSelectedGroupId(updatedGroup.id)
				setGroupForm(toGroupForm(updatedGroup))
				setNotice(`Группа ${updatedGroup.name} обновлена.`)
				return
			}

			const createdGroup = normalizeAgentGroupRecord(
				await apiClient.request<unknown>({
					method: 'POST',
					path: 'agent-groups',
					body: {
						name: groupForm.name,
						description: groupForm.description,
						agentIds: groupForm.agentIds
					}
				})
			)

			await loadAllData()
			setSelectedGroupId(createdGroup.id)
			setGroupForm(toGroupForm(createdGroup))
			setNotice(`Группа ${createdGroup.name} создана.`)
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: 'Не удалось сохранить группу.'
			)
		} finally {
			setGroupSubmitting(false)
		}
	}

	const toggleAgentInGroup = (agentId: string) => {
		setGroupForm(currentForm => {
			const hasAgent = currentForm.agentIds.includes(agentId)

			return {
				...currentForm,
				agentIds: hasAgent
					? currentForm.agentIds.filter(currentId => currentId !== agentId)
					: [...currentForm.agentIds, agentId]
			}
		})
	}

	const groupOptions = useMemo(
		() =>
			[{ id: 0, name: 'No group' }, ...groups.map(group => ({ id: group.id, name: group.name }))],
		[groups]
	)

	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/8 px-3 py-1.5 text-xs font-medium text-sky-700">
								<Users className="size-3.5" />
								Agents registry
							</div>
							<div className="space-y-3">
								<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
									Управление агентами и группами хостов
								</h1>
								<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
									На этой странице можно создавать агентов, обновлять их статус и
									раскладывать серверы по группам для дальнейшей работы с логами.
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Agents
								</p>
								<p className="mt-3 text-3xl font-semibold text-foreground">
									{agents.length}
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									Всего зарегистрированных агентов.
								</p>
							</div>
							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Online
								</p>
								<p className="mt-3 text-3xl font-semibold text-foreground">
									{onlineAgentsCount}
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									Агенты в статусе online.
								</p>
							</div>
							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Groups
								</p>
								<p className="mt-3 text-3xl font-semibold text-foreground">
									{groups.length}
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									Группы хостов для логов.
								</p>
							</div>
						</div>
					</div>
				</div>

				{error ? (
					<div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				) : null}

				{notice ? (
					<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700">
						{notice}
					</div>
				) : null}

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
					<div className="space-y-6">
						<Card className="flex h-[430px] min-h-0 flex-col border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">Agents list</CardTitle>
										<CardDescription>
											Список всех агентов с выбором записи для детального просмотра
											и редактирования.
										</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => void loadAllData()}
											disabled={loading}
										>
											<RefreshCw className="size-4" />
											Refresh
										</Button>
										<Button
											size="sm"
											onClick={handleCreateNewAgent}
										>
											<PlusCircle className="size-4" />
											New agent
										</Button>
									</div>
								</div>
							</CardHeader>

							<CardContent className="flex-1 space-y-3 overflow-y-auto pt-5 pr-2">
								{agents.map(agent => (
									<div
										key={agent.agentId}
										onClick={() => void openAgent(agent.agentId)}
										className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
											selectedAgentId === agent.agentId
												? 'border-foreground/15 bg-muted/55 shadow-sm'
												: 'border-border/60 bg-background/80'
										}`}
									>
										<div className="flex items-start justify-between gap-3">
											<div className="space-y-1">
												<p className="text-sm font-semibold text-foreground">
													{agent.name || agent.agentId}
												</p>
												<p className="text-xs text-muted-foreground">
													{agent.host} • {agent.hostIp}
												</p>
											</div>
											<span
												className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusTone(agent.status)}`}
											>
												{agent.status || 'unknown'}
											</span>
										</div>
										<div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
											<div>Agent ID: {agent.agentId || 'unknown'}</div>
											<div>Group: {agent.groupName || 'No group'}</div>
											<div>Buffered: {agent.bufferedCount}</div>
											<div>Last seen: {formatDate(agent.lastSeen)}</div>
										</div>
									</div>
								))}

								{!loading && agents.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-6 text-sm text-muted-foreground">
										Агенты ещё не созданы.
									</div>
								) : null}
							</CardContent>
						</Card>

						<Card className="flex h-[430px] min-h-0 flex-col border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">Agent groups</CardTitle>
										<CardDescription>
											Группы хостов с агентами внутри. Удобно для разделения prod,
											staging и других контуров.
										</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => void loadAllData()}
											disabled={loading}
										>
											<RefreshCw className="size-4" />
											Refresh
										</Button>
										<Button
											size="sm"
											onClick={handleCreateNewGroup}
										>
											<PlusCircle className="size-4" />
											New group
										</Button>
									</div>
								</div>
							</CardHeader>

							<CardContent className="flex-1 space-y-3 overflow-y-auto pt-5 pr-2">
								{groups.map(group => (
									<div
										key={group.id}
										onClick={() => void openGroup(group.id)}
										className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
											selectedGroupId === group.id
												? 'border-foreground/15 bg-muted/55 shadow-sm'
												: 'border-border/60 bg-background/80'
										}`}
									>
										<div className="flex items-start justify-between gap-3">
											<div className="space-y-1">
												<p className="text-sm font-semibold text-foreground">
													{group.name || `Group ${group.id}`}
												</p>
												<p className="text-xs text-muted-foreground">
													{group.description || 'Без описания'}
												</p>
											</div>
											<span className="inline-flex rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground">
												{group.agentCount} agents
											</span>
										</div>
										<div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
											<div>Created: {formatDate(group.createdAt)}</div>
											<div>Updated: {formatDate(group.updatedAt)}</div>
										</div>
									</div>
								))}

								{!loading && groups.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-6 text-sm text-muted-foreground">
										Группы ещё не созданы.
									</div>
								) : null}
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">
											{selectedAgent ? 'Edit agent' : 'Create agent'}
										</CardTitle>
										<CardDescription>
											POST `/api/v1/agents` и PUT `/api/v1/agents/{'{id}'}`.
										</CardDescription>
									</div>
									<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
										<Server className="mr-2 inline size-3.5" />
										{selectedAgent ? selectedAgent.agentId : 'new'}
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4 pt-5">
								<div className="grid gap-4 md:grid-cols-2">
									<Field>
										<Input
											placeholder="agentId"
											value={agentForm.agentId}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													agentId: event.target.value
												}))
											}
											disabled={selectedAgentId !== null}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Agent name"
											value={agentForm.name}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													name: event.target.value
												}))
											}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Host"
											value={agentForm.host}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													host: event.target.value
												}))
											}
											disabled={selectedAgentId !== null}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Host IP"
											value={agentForm.hostIp}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													hostIp: event.target.value
												}))
											}
											disabled={selectedAgentId !== null}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Status"
											value={agentForm.status}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													status: event.target.value
												}))
											}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Buffered count"
											value={agentForm.bufferedCount}
											onChange={event =>
												setAgentForm(currentForm => ({
													...currentForm,
													bufferedCount: event.target.value
												}))
											}
											disabled={selectedAgentId !== null}
										/>
									</Field>
								</div>

								<Field>
									<Select
										value={agentForm.groupId}
										onValueChange={value =>
											setAgentForm(currentForm => ({
												...currentForm,
												groupId: value
											}))
										}
									>
										<SelectTrigger className="h-11 w-full bg-background/80">
											<SelectValue placeholder="Group" />
										</SelectTrigger>
										<SelectContent position="popper">
											<SelectGroup>
												{groupOptions.map(group => (
													<SelectItem
														key={group.id}
														value={String(group.id)}
													>
														{group.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<div className="flex flex-wrap gap-3">
									<Button
										onClick={() => void handleAgentSubmit()}
										disabled={agentSubmitting}
									>
										<Save className="size-4" />
										{selectedAgent ? 'Update agent' : 'Create agent'}
									</Button>
									<Button
										variant="secondary"
										onClick={handleCreateNewAgent}
									>
										<PlusCircle className="size-4" />
										Reset form
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">
											{selectedGroup ? 'Edit group' : 'Create group'}
										</CardTitle>
										<CardDescription>
											POST `/api/v1/agent-groups` и PUT `/api/v1/agent-groups/{'{id}'}`.
										</CardDescription>
									</div>
									<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
										<FolderTree className="mr-2 inline size-3.5" />
										{selectedGroup ? selectedGroup.name : 'new'}
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4 pt-5">
								<div className="grid gap-4">
									<Field>
										<Input
											placeholder="Group name"
											value={groupForm.name}
											onChange={event =>
												setGroupForm(currentForm => ({
													...currentForm,
													name: event.target.value
												}))
											}
										/>
									</Field>
									<Field>
										<Input
											placeholder="Description"
											value={groupForm.description}
											onChange={event =>
												setGroupForm(currentForm => ({
													...currentForm,
													description: event.target.value
												}))
											}
										/>
									</Field>
								</div>

								<div className="space-y-3">
									<div className="flex items-center justify-between gap-3">
										<p className="text-sm font-medium text-foreground">
											Agents in group
										</p>
										<span className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground">
											{groupForm.agentIds.length} selected
										</span>
									</div>

									<div className="max-h-[260px] space-y-2 overflow-y-auto rounded-2xl border border-border/60 bg-background/70 p-3">
										{agents.map(agent => {
											const checked = groupForm.agentIds.includes(agent.agentId)

											return (
												<label
													key={agent.agentId}
													className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-background px-3 py-2"
												>
													<input
														type="checkbox"
														className="mt-1"
														checked={checked}
														onChange={() => toggleAgentInGroup(agent.agentId)}
													/>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-foreground">
															{agent.name || agent.agentId}
														</p>
														<p className="text-xs text-muted-foreground">
															{agent.host} • {agent.agentId}
														</p>
													</div>
													<span
														className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${getStatusTone(agent.status)}`}
													>
														{agent.status || 'unknown'}
													</span>
												</label>
											)
										})}

										{agents.length === 0 ? (
											<div className="rounded-xl border border-dashed border-border/60 bg-background p-4 text-sm text-muted-foreground">
												Сначала создай хотя бы одного агента.
											</div>
										) : null}
									</div>
								</div>

								<div className="flex flex-wrap gap-3">
									<Button
										onClick={() => void handleGroupSubmit()}
										disabled={groupSubmitting}
									>
										<Save className="size-4" />
										{selectedGroup ? 'Update group' : 'Create group'}
									</Button>
									<Button
										variant="secondary"
										onClick={handleCreateNewGroup}
									>
										<PlusCircle className="size-4" />
										Reset form
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl">Selection details</CardTitle>
								<CardDescription>
									Быстрый просмотр выбранного агента и выбранной группы.
								</CardDescription>
							</CardHeader>

							<CardContent className="grid gap-4 pt-1 lg:grid-cols-2">
								<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
									<div className="mb-3 flex items-center gap-2">
										<Network className="size-4 text-muted-foreground" />
										<p className="text-sm font-medium text-foreground">
											Agent details
										</p>
									</div>
									{selectedAgent ? (
										<div className="space-y-2 text-sm text-muted-foreground">
											<div>Name: {selectedAgent.name || 'unknown'}</div>
											<div>Agent ID: {selectedAgent.agentId || 'unknown'}</div>
											<div>Host: {selectedAgent.host || 'unknown'}</div>
											<div>IP: {selectedAgent.hostIp || 'unknown'}</div>
											<div>Status: {selectedAgent.status || 'unknown'}</div>
											<div>Group: {selectedAgent.groupName || 'No group'}</div>
											<div>Last seen: {formatDate(selectedAgent.lastSeen)}</div>
										</div>
									) : (
										<p className="text-sm text-muted-foreground">
											Выбери агента слева, чтобы увидеть детали.
										</p>
									)}
								</div>

								<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
									<div className="mb-3 flex items-center gap-2">
										<FolderTree className="size-4 text-muted-foreground" />
										<p className="text-sm font-medium text-foreground">
											Group details
										</p>
									</div>
									{selectedGroup ? (
										<div className="space-y-2 text-sm text-muted-foreground">
											<div>Name: {selectedGroup.name || 'unknown'}</div>
											<div>Description: {selectedGroup.description || 'none'}</div>
											<div>Agents: {selectedGroup.agentCount}</div>
											<div>Created: {formatDate(selectedGroup.createdAt)}</div>
											<div>Updated: {formatDate(selectedGroup.updatedAt)}</div>
										</div>
									) : (
										<p className="text-sm text-muted-foreground">
											Выбери группу слева, чтобы увидеть детали.
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	)
}
