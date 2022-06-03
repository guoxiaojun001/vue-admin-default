const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  visitedViews: state => state.tagsView.visitedViews,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  userType: state => state.user.userType
}
export default getters
