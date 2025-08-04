const Analytics = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">Track your project performance and team productivity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress</h3>
          <div className="space-y-4">
            {["Website Redesign", "Mobile App", "API Development"].map((project, index) => (
              <div key={project}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{project}</span>
                  <span className="text-gray-900">{[75, 45, 90][index]}%</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${[75, 45, 90][index]}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            {["Tasks Completed", "On-time Delivery", "Client Satisfaction"].map((metric, index) => (
              <div key={metric} className="flex justify-between items-center">
                <span className="text-gray-600">{metric}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {[156, 89, 94][index]}
                  {index === 2 ? "%" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
