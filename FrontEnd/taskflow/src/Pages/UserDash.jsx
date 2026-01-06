import Sidebar from '../components/Sidebar'

const Column = ({ title, tasks }) => (
  <div className="flex-1 bg-slate-100 p-4 rounded-xl min-h-[500px]">
    <h3 className="font-bold mb-4 text-slate-600 uppercase text-sm tracking-wider">{title}</h3>
    {tasks.map((task) => (
      <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-slate-200">
        <p className="font-medium">{task.title}</p>
        <span className="text-xs text-slate-400 mt-2 block">Project: {task.project?.name || task.project}</span>
      </div>
    ))}
  </div>
)

export default function UserDash() {
  const tasks = []
  return (
    <div className="flex min-h-screen">
      <Sidebar role="member" />
      <main className="flex-1 p-8 bg-white">
        <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
        <div className="flex gap-6">
          <Column title="To Do" tasks={tasks.filter((t) => t.status === 'todo')} />
          <Column title="In Progress" tasks={tasks.filter((t) => t.status === 'in_progress')} />
          <Column title="Done" tasks={tasks.filter((t) => t.status === 'done')} />
        </div>
      </main>
    </div>
  )
}
