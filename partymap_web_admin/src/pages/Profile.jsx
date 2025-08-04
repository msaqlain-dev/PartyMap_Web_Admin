const Profile = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-600">View and manage your profile information.</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-6 mb-6">
            <img
              className="h-24 w-24 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-600">Senior Developer</p>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900">+1 (555) 123-4567</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-sm text-gray-900">San Francisco, CA</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Joined</dt>
                  <dd className="text-sm text-gray-900">January 2023</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Projects Completed</dt>
                  <dd className="text-sm text-gray-900">24</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tasks Completed</dt>
                  <dd className="text-sm text-gray-900">156</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Team Rating</dt>
                  <dd className="text-sm text-gray-900">4.8/5.0</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
