const Dashboard = () => {
  const stats = [
    { name: "Total Maps", value: "47", change: "+12%", changeType: "positive" },
    {
      name: "Active Customers",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      name: "Map Views Today",
      value: "8,945",
      change: "+23.1%",
      changeType: "positive",
    },
    {
      name: "Revenue This Month",
      value: "$12,450",
      change: "+4.3%",
      changeType: "positive",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New map created",
      user: "John Smith",
      time: "2 hours ago",
      type: "map",
    },
    {
      id: 2,
      action: "Customer subscription renewed",
      user: "Acme Corp",
      time: "4 hours ago",
      type: "customer",
    },
    {
      id: 3,
      action: "Map markers updated",
      user: "Jane Doe",
      time: "6 hours ago",
      type: "map",
    },
    {
      id: 4,
      action: "New customer registered",
      user: "Tech Solutions",
      time: "8 hours ago",
      type: "customer",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "map":
        return "🗺️";
      case "customer":
        return "👤";
      default:
        return "📊";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your map portal activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div
                        className={`text-sm font-medium ${
                          item.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {getActivityIcon(item.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-500">
                      {item.user} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Usage Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Map Usage Analytics
            </h3>
            <div className="space-y-4">
              {[
                "Interactive Maps",
                "Static Maps",
                "Satellite View",
                "Street View",
              ].map((mapType, index) => (
                <div key={mapType}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{mapType}</span>
                    <span className="text-gray-900">
                      {[45, 32, 18, 12][index]}%
                    </span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${[45, 32, 18, 12][index]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
